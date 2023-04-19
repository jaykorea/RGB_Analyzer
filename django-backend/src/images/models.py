# -*- coding:utf-8 -*-
from django.db import models
import os
import glob
from pathlib import Path
import glob
import cv2
import numpy as np
import math
from io import BytesIO
from django.core.files.base import ContentFile
from django.conf import settings
import time

DEBUG = False

class Image(models.Model):
    image = models.ImageField()
    processed_image = models.ImageField(null=True, blank=True, upload_to='processed_images/')
    analyzed = models.CharField(max_length=200, blank=True)
    analyzed_info = models.CharField(max_length=500, blank=True)
    e_hr = models.CharField(max_length=30, null=True)
    e_min = models.CharField(max_length=30, null=True)
    uploaded_time = models.DateTimeField(auto_now_add=True)

    BASE_PATH = os.path.dirname(os.path.abspath(__file__))
    ROOT_PATH = Path(BASE_PATH).parent.parent
    MEDIA_ROOT = settings.MEDIA_ROOT
    
    def __str__(self):
        return "Image analyzed at {}".format(self.uploaded_time.strftime("%Y-%m-%d %H:%M"))

    def convert_to_png(self, input_image):
        # Convert the input image to PNG format
        _, buffer = cv2.imencode('.png', input_image)
        png_image = buffer.tobytes()
        return png_image

    def resize_image(self, input_image, w, h):
        # Resize the input image to a resolution of 320x240
        resized_image = cv2.resize(input_image, (w, h))
        return resized_image

    def img_debug(self, input_image):
        input_image = cv2.resize(input_image, dsize=(640,480), interpolation=cv2.INTER_AREA)
        cv2.imshow('image result', input_image)
        cv2.waitKey(0)

    def remove_img(self, path, img_name):
        # check if file exists or not
        if os.path.exists(path + '/' + img_name) is True:
            os.remove(path + '/' + img_name)
        else:
            # file did not exists
            return False

    def delete_old_files(self, max_files=1000):
        processed_images_dir = os.path.join(self.MEDIA_ROOT, 'processed_images')
        media_root_dir = self.MEDIA_ROOT
        for directory in [processed_images_dir, media_root_dir]:
            files = glob.glob(os.path.join(directory, '*'))
            if len(files) > max_files:
                files.sort(key=os.path.getmtime)
                for file_path in files[:len(files) - max_files]:
                    os.remove(file_path)

    def save(self, *args, **kwargs):
        try:
            print("Analyzing...\nPlease Wait")

            # Read the image using OpenCV
            input_image = cv2.imdecode(np.fromstring(self.image.read(), np.uint8), cv2.IMREAD_UNCHANGED)
            
            # Check the image size
            if input_image.shape[0] * input_image.shape[1] > 100000000:
                raise ValueError("Image too large")

            # YOLO image processing from here----------------------------------------------------------------------
            
            # weight_path = '/home/image_classifier/django-react-image-classification/django-backend/src/images/config/yolov3.weights'
            # cfg_path = '/home/image_classifier/django-react-image-classification/django-backend/src/images/config/yolov3.cfg'
            # net = cv2.dnn.readNet(cfg_path, weight_path)
            # net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
            # net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)

            # YOLO image processing to here------------------------------------------------------------------------
            # FIND ROI from here ----------------------------------------------------------------------------------

            SD = SampleDetector()
            output_dic = SD.detect_samples(DEBUG,input_image,self.e_hr,self.e_min)
            result_image = output_dic["image"]
            result_analyzed = '\n'.join(output_dic["result_analyzed"])
            result_analyzed_info = '\n'.join(output_dic["result_analyzed_info"])
            print(result_analyzed_info)
            self.analyzed = result_analyzed
            self.analyzed_info = result_analyzed_info

	    # Save the processed image to the processed_image field
            buffer = BytesIO()
            extension = str(self.image.name).split(".")[-1]
            # result_image = cv2.cvtColor(result_image, cv2.COLOR_BGR2RGB) # Convert from BGR to RGB ( I think it is already BGR maybe not?)
            filename = f'{self.image.name.split(".")[0]}_processed.{extension}'
            with open(filename, 'wb') as f:
                cv2.imwrite(filename, result_image)
            self.processed_image.save(filename, ContentFile(open(filename, 'rb').read()), save=False)
            if not self.remove_img(f'{Path(self.BASE_PATH).parent}', filename):
                print('File not Exist. Can not Delete it! ...')

            print('Analyze success!')
            self.delete_old_files()
        except Exception as e:
            print('Analyze failed: ', e)
        super().save(*args, **kwargs)

class SampleDetector:
    def __init__(self):
        pass

    def iou(self, bbox1, bbox2):
        x1, y1, w1, h1 = bbox1
        x2, y2, w2, h2 = bbox2
    
        x_inter_left = max(x1, x2)
        y_inter_top = max(y1, y2)
        x_inter_right = min(x1 + w1, x2 + w2)
        y_inter_bottom = min(y1 + h1, y2 + h2)
    
        if x_inter_left < x_inter_right and y_inter_top < y_inter_bottom:
            inter_area = (x_inter_right - x_inter_left) * (y_inter_bottom - y_inter_top)
            bbox1_area = w1 * h1
            bbox2_area = w2 * h2
            union_area = bbox1_area + bbox2_area - inter_area
            return inter_area / union_area
    
        return 0

    def detect_samples(self, DEBUG, input_image,e_hr,e_min):

        # Convert the image to grayscale
        gray = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

        # Apply Gaussian blur to reduce noise
        gray = cv2.GaussianBlur(gray, (15, 15), 0)
 
        # Apply adaptive thresholding to separate the samples from the background
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 131, 4) 

        # Apply morphological operations to remove noise and fill gaps in the samples
        kernel = np.ones((3, 3), np.uint8)
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=1)
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)

        if DEBUG:
            img = cv2.resize(thresh,(1024,768))
            cv2.imshow('Detected samples', img)
            cv2.waitKey(0)

        # Find contours in the thresholded image
        contours, hierarchy = cv2.findContours(thresh, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE) # RETR_EXTERNAL

        # Detect circles using HoughCircles
        circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1.2, 100)
        detected_circles = []

        if circles is not None:
            detected_circles = np.round(circles[0, :]).astype("int")

        # Get the bounding boxes of the rectangular and circular contours
        square_bounding_boxes = []
        circle_bounding_boxes = []
        min_area = 1000  # Set a minimum area threshold
        aspect_ratio_tolerance = 0.35  # Set an aspect ratio tolerance

        for contour in contours:
            # Find the area of the contour
            area = cv2.contourArea(contour)

            # Approximate the contour with a polygon
            perimeter = cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, 0.02 * perimeter, True)
            # Check if the contour is a circle
            if area > min_area:
                for (x, y, r) in detected_circles:
                    circle_center = np.array([x, y])
                    distance_to_contour = cv2.pointPolygonTest(contour, (x, y), True)
                    if distance_to_contour < r:
                        circle_bounding_boxes.append((x - r, y - r, 2 * r, 2 * r))
                        break

            if len(approx) == 4:
                # If the polygon has 4 sides, it is likely a rectangle
                x, y, w, h = cv2.boundingRect(contour)
                area = w * h
                aspect_ratio = float(w) / h

                # Check if the aspect ratio is close to 1 (square)
                if w > 120 and h > 120 and area > min_area and (1 - aspect_ratio_tolerance) < aspect_ratio < (1 + aspect_ratio_tolerance):
                    square_bounding_boxes.append((x, y, w, h))

        iou_threshold = 0.5
        filtered_boxes = []

        for bbox in square_bounding_boxes:
            overlaps = [self.iou(bbox, other_bbox) for other_bbox in filtered_boxes]
            if not any(overlap > iou_threshold for overlap in overlaps):
                filtered_boxes.append(bbox)
        square_bounding_boxes = filtered_boxes


        filtered_boxes = []
        for bbox in circle_bounding_boxes:
            overlaps = [self.iou(bbox, other_bbox) for other_bbox in filtered_boxes]
            if not any(overlap > iou_threshold for overlap in overlaps):
                filtered_boxes.append(bbox)
        circle_bounding_boxes = filtered_boxes
        
        # Sort the bounding boxes from left to right
        square_bounding_boxes = sorted(square_bounding_boxes, key=lambda x: x[0])
        circle_bounding_boxes = sorted(circle_bounding_boxes, key=lambda x: x[0])
        sample_avg_color=[]
        blank_avg_color=[]
        debug_avg_color=[]
        result_analyzed=[]
        shrink_percentage = 0.35  # Set a shrink percentage (e.g., 0.1 for 10%)

        # Get the ROIs for the rectangular samples and draw rectangles on the image
        for i, bbox in enumerate(square_bounding_boxes):
            x, y, w, h = bbox
            shrink_w = int(w * shrink_percentage)
            shrink_h = int(h * shrink_percentage)
            roi = input_image[y + shrink_h:y + h - shrink_h, x + shrink_w:x + w - shrink_w]
            avg_bgr_color = np.mean(roi, axis=(0, 1))
            cv2.rectangle(input_image, (x, y), (x+w, y+h), (0, 255, 0), 30)
            # cv2.putText(input_image, f"Sample {i+1}", (x+520, y+260), cv2.FONT_HERSHEY_SIMPLEX, 5, (int(avg_bgr_color[0]), int(avg_bgr_color[1]), int(avg_bgr_color[2])), 15, cv2.LINE_AA)
            cv2.putText(input_image, f"Sample {i+1}", (x+520, y+260), cv2.FONT_HERSHEY_SIMPLEX, 5, (0, 255, 0), 15, cv2.LINE_AA)     
            # print(f'Sample {i+1} has average BGR value of {avg_bgr_color}')
            debug_avg_color.append(("Sample %d BGR : %d, %d, %d" %(i+1, int(avg_bgr_color[0]),int(avg_bgr_color[1]),int(avg_bgr_color[2]))))
            sample_avg_color.append(int(avg_bgr_color[0]))

        for i, bbox in enumerate(circle_bounding_boxes):
            x, y, w, h = bbox
            shrink_w = int(w * shrink_percentage)
            shrink_h = int(h * shrink_percentage)
            roi = input_image[y + shrink_h:y + h - shrink_h, x + shrink_w:x + w - shrink_w]
            avg_bgr_color = np.mean(roi, axis=(0, 1))
            cv2.rectangle(input_image, (x, y), (x+w, y+h), (0, 0, 255), 30)
            cv2.putText(input_image, f"Blank {i+1}", (x+520, y+260), cv2.FONT_HERSHEY_SIMPLEX, 5, (0, 0, 255), 15, cv2.LINE_AA)
            # print(f'Sample {i+1} has average BGR value of {avg_bgr_color}')
            debug_avg_color.append(("Blank %d BGR : %d, %d, %d" %(i+1, int(avg_bgr_color[0]),int(avg_bgr_color[1]),int(avg_bgr_color[2]))))
            blank_avg_color.append(int(avg_bgr_color[0]))

        # Display the image with the detected samples
        if DEBUG:
            cv2.imshow('Detected samples', input_image)
            cv2.waitKey(0)
            cv2.destroyAllWindows()

        if len(sample_avg_color) > 0 :
            averaged_sample_avg_color = sum(sample_avg_color)/len(sample_avg_color)
        else:
            averaged_sample_avg_color = 0
        if len(blank_avg_color) > 0:
            averaged_blank_avg_color = sum(blank_avg_color)/len(blank_avg_color)
        else:
            averaged_blank_avg_color = 0

        e_T = float(e_hr)+(float(e_min)*0.0166667)
        if averaged_blank_avg_color != 0 and averaged_sample_avg_color !=0:
            EA_sub_b = -math.log10(float(averaged_sample_avg_color)/float(averaged_blank_avg_color))
        else:
            EA_sub_b = 0
        O_sub_3 = (EA_sub_b - 0.0052)/(0.00909*0.31309)
        PPB = O_sub_3*(8.0/e_T)
        S_TWA = O_sub_3
        
        if S_TWA > 0 :
            result_analyzed.append(str(PPB))
        else:
            result_analyzed.append("Failed to analyze")
        print(EA_sub_b, PPB)
        result_analyzed_info=debug_avg_color
        result_analyzed_info.append("PPB : %.4f" %(PPB))
        result_analyzed_info.append("Exposure time : %.1fhr" %(e_T))
        output_dic={"image": input_image, "result_analyzed": result_analyzed, 'result_analyzed_info': result_analyzed_info}
        # output_arr.append(input_image)
        # output_arr.append(sample_avg_color)

        return output_dic
