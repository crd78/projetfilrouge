# Generated by Django 5.2.4 on 2025-07-17 15:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='QuantiteStock',
        ),
    ]
