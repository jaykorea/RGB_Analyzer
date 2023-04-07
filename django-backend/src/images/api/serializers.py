from ..models import Image
from rest_framework import serializers


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = '__all__'
        # fields = ('picture', 'e_hr', 'e_min')
        # exclude = ('field1','field2')

    def get_processed_image_data(self, obj):
        return obj.processed_image.decode('utf-8') if obj.processed_image else None