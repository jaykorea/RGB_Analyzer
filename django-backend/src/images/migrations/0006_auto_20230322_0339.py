# Generated by Django 2.2 on 2023-03-22 03:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('images', '0005_auto_20230322_0337'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='uploaded',
            new_name='uploaded_time',
        ),
    ]
