from rest_framework import viewsets
from .serializers import ImageSerializer
from ..models import Image

from rest_framework import status
from rest_framework.response import Response

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all().order_by('-uploaded_time')
    serializer_class = ImageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the image instance
        self.perform_create(serializer)

        # Get the classified field value from the saved image instance
        analyzed = serializer.instance.analyzed
        processed_image_data = None

        if serializer.instance.processed_image:
            processed_image_data = serializer.instance.processed_image.read()

        # Return the response with the serialized image instance, the classified field value, and the processed image data
        headers = self.get_success_headers(serializer.data)
        response_data = {
            **serializer.data,
            'analyzed': analyzed,
            'processed_image': processed_image_data,
        }
               
        # Return the response with the serialized image instance and the classified field value
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)