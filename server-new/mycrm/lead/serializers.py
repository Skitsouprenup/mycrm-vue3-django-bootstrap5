from django.contrib.auth.models import User

from rest_framework import serializers

from .models import Lead
from team.serializers import UserSerializer

#Serializers allow complex data such as querysets and model instances to be converted
#to native Python datatypes that can then be easily rendered into JSON,
#XML or other content types.
class LeadSerializer(serializers.ModelSerializer):
    #read data from the serializer
    assigned_to = UserSerializer(read_only=True)
    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = (
            'team',
            'created_by',
            'created_at',
            'modified_at',
        )

class UserOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', )

class LeadReducedSerializer(serializers.ModelSerializer):
    #User custorm serializer for assigned_to
    assigned_to = UserSerializer(read_only=True)
    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = (
            'team',
            'created_by',
            'created_at',
            'modified_at',
        )

#include assigned_to in the fields even it's read-only here.
#Otherwise you'll get this error:
"""
The field 'assigned_to' was declared on serializer 
LeadSummarizedSerializer, but has not been included 
in the 'fields' option.
"""
class LeadSummarizedSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    class Meta:
        model = Lead
        fields = (
            'id',
            'company',
            'contact_person',
            'status',
            'assigned_to'
        )