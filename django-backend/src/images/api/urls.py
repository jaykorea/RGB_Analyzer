from .views import ImageViewSet
from rest_framework import routers
from django.urls import path, include
from django.conf.urls import url, include
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

app_name = 'api-images'

router = routers.DefaultRouter()
router.register(r'images', ImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
