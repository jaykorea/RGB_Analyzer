# RGB Analyzer Web App with Django and React
<img src="https://user-images.githubusercontent.com/95605860/229193303-5710df65-3dea-4def-9321-31ed0c082984.png" width=30% height=30%> <img src="https://user-images.githubusercontent.com/95605860/229193314-78e0cfce-34f8-4898-bbe6-cdcce667974a.png" width=30% height=30%>
<img src="https://user-images.githubusercontent.com/95605860/229193326-40e961e0-a60a-4826-bda4-b216292fccac.png" width=30% height=30%> <img src="https://user-images.githubusercontent.com/95605860/229193328-06c9487f-c0f8-455e-827f-8ab79f5bb1c6.png" width=30% height=30%> <img src="https://user-images.githubusercontent.com/95605860/229193333-2a4aab1d-3d03-4cb0-9e3d-a3372edaad64.png" width=30% height=30%>

## Project Objectives
- Create a REST API with Django Rest Framework
- Analyze images on the backend using opencv4
- Integrate Django and React

# Instructions
## run backend server(It is already integrated with react frontend)
### Create virtual env with virtualenv
```
virtualenv py36
source py36/bin/activate
```
### install python packages
```
pip3 install -r requirements.txt
or
pip install -r requirements.txt
```
### To run server on local machine, just type it on backend root folder(that the manage.py located, server starts on port 8001)
```
python3 manage.py --insecure 0.0.0.0:8001
```
### to modify frontend, just replace the 'build' folder with generated built files

## To run frontend server independently(It is already integrated with django backend)
### swith debug to True on whatimage/settings.py
```
DEBUG=False
```
### install package with command on the frontend root folder
```
npm install
```
### Run backend server on the django backend main project folder(It starts on the port 8001, Should remove the --insecure args)
```
python3 manage.py 0.0.0.0:8001
```
### Run frontend server (It starts on the port 3001)
```
npm start
```
### access web with chrome(or other browser), related urls are requesting with dynamic host IP, so access it with its host ip with port 3001
```
192.168.0.9:3001 (for mine)
```
## To build frontend just type on frontend root folder (Just paste the build folder to django backend root folder)
```
npm run build
```

# for aws ec2

## colect static files on root folder
```
python manage.py collectstatic
```
## install nginx
```
sudo apt-get install nginx
```
## configure nginx file on /etc/nginx/sites-available/rgbanalyzer
```                                                               
upstream django_app {
    server 127.0.0.1:8001;
}

server {
    listen 80;
    server_name www.zeroexposure1905.com;

    location / {
        proxy_pass http://django_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /home/ubuntu/RGB_Analyzer_django_react/django_backend/src/staticfiles/;
    }

    location /media/ {
        alias /home/ubuntu/RGB_Analyzer_django_react/django_backend/media_root/;
    }
}

```
## link nginx file
```
sudo ln -s /etc/nginx/sites-available/rgbanalyzer /etc/nginx/sites-enabled/
```
## restart nginx
```
sudo systemctl restart nginx
```
## install gunicorn
```
pip install gunicorn
```
## launch server with gunicorn on root folder(for mine)
```
gunicorn --bind 0.0.0.0:8001 whatimage.wsgi:application
```
## check the log
```
gunicorn --bind 0.0.0.0:8001 --daemon whatimage.wsgi:application --log-file /home/ubuntu/RGB_Analyzer_django_react/server_log/logfile.log
```
```
tail -f /home/ubuntu/RGB_Analyzer_django_react/server_log/logfile.log
```
## kill server
```
ps aux | grep gunicorn
```
```
kill -9 <PID>
```

# request example
```
getImages = () => {
    axios.get(`https://www.zeroexposure1905.com/api/images/`, {
        headers: {
            'accept': 'application/json'
        }
    }).then(resp => {
        this.setState({
            images: resp.data,
            status: true
        })
        console.log(resp)
    })
    this.setState({ isLoading: false })
};
```


### package tree should be look like this
```
.
├── django-react-image-classification
│   ├── django-backend
│   │   ├── media_root
│   │   │   └── processed_images
│   │   └── src
│   │       ├── build
│   │       ├── db.sqlite3
│   │       ├── images
│   │       ├── manage.py
│   │       └── whatimage
│   ├── react-frontend
│   │   └── image-front
│   │       ├── build
│   │       ├── node_modules
│   │       ├── package.json
│   │       ├── package-lock.json
│   │       ├── public
│   │       ├── README.md
│   │       └── src
│   ├── README.md
│   └── requirements.txt
└── py36
    ├── bin
    │   ├── activate
    │   ├── activate.csh
    │   ├── activate.fish
    │   ├── activate.nu
    │   ├── activate.ps1
    │   ├── activate_this.py
    │   ├── chardetect
    │   ├── django-admin
    │   ├── django-admin.py
    │   ├── f2py
    │   ├── f2py3
    │   ├── f2py3.6
    │   ├── google-oauthlib-tool
    │   ├── markdown_py
    │   ├── pip
    │   ├── pip3
    │   ├── pip-3.6
    │   ├── pip3.6
    │   ├── __pycache__
    │   │   └── django-admin.cpython-36.pyc
    │   ├── pyrsa-decrypt
    │   ├── pyrsa-encrypt
    │   ├── pyrsa-keygen
    │   ├── pyrsa-priv2pub
    │   ├── pyrsa-sign
    │   ├── pyrsa-verify
    │   ├── python -> /usr/bin/python3
    │   ├── python3 -> python
    │   ├── python3.6 -> python
    │   ├── saved_model_cli
    │   ├── sqlformat
    │   ├── tensorboard
    │   ├── tflite_convert
    │   ├── tf_upgrade_v2
    │   ├── toco
    │   ├── toco_from_protos
    │   ├── wheel
    │   ├── wheel3
    │   ├── wheel-3.6
    │   └── wheel3.6
    ├── lib
    │   └── python3.6
    │       └── site-packages
    ├── pyvenv.cfg
    └── share
        └── doc
            └── jwcrypto
```
## Run with docker
### Just pull the image (It basically run on Ubuntu18.04 LTS)
```
docker pull jaykor97/ml_mlr:rev.05
```
### docker run command (for mine, feel free to modify)
```
sudo docker run --init --privileged -it --name korea_chs -v /dev:/dev --net=host --gpus all -e DISPLAY=$DISPLAY -e QT_X11_NO_MITSHM=1 -v ~/docker_image/data:/home/data -e NVIDIA_DRIVER_CAPABILITIES=all --rm jaykor97/ml_mlr:rev.05 /bin/zsh
```

## Run with docker Compose
### docker compose file below
```
version: "2"

services:

  django_backend:
    image: jaykor97/ml_mlr:rev.05
    container_name: django_backend
    deploy:
      resources:
        reservations:
          devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
    stdin_open: true
    tty: true
    environment:
      - "PYTHONIOENCODING='UTF-8'"
    volumes:
      - "/tmp/.X11-unix:/tmp/.X11-unix:rw"
      - "/dev:/dev"
      # - "./static_files/build:/home/image_classifier/django-react-image-classification/django-backend/src/build"
      # - "./media_files/media_root:/home/image_classifier/django-react-image-classification/django-backend/media_root"
    command: ["/bin/bash", "-c", "cd /home/image_classifier;source py36/bin/activate;cd django-react-image-classification/django-backend/src;python3 manage.py makemigrations;python3 manage.py migrate;python3 manage.py runserver --insecure 0.0.0.0:8001;"]
    network_mode: host
    ports:
      - "8001:8001"
    expose:
      - "8001"

```
### run docker compose
```
docker-compose -f docker-compose.yaml build
docker-compose -f docker-compose.yaml up
```
