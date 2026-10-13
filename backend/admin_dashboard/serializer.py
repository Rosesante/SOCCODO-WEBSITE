from django.contrib.auth.models import User
from rest_framework import serializers, serliazers
from .models import *

class messageSerializer(serializers.Serializer):