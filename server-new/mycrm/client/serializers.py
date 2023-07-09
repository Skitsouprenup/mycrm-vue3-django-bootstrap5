from rest_framework import serializers

from .models import Client, Note

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        exclude = ('created_by', )
        read_only_fields = (
            'team',
            'created_by',
            'created_at',
            'modified_at',
        )

class ClientSummarizedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = (
            'id',
            'name',
            'contact_person',
        )

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = (
            'id',
            'name',
            'body',
        )
        read_only_fields = (
            'team',
            'client',
            'created_by',
            'created_at',
            'modified_at',
        )