# vim: ai ts=4 sts=4 et sw=4
from django.db import models


TYPE_CHOICES = (
    ('A','Administrator'),
    ('D','Domain admin'),
    ('U','User'),
    ('R','User (regex)'),
    ('H','Host'),
)

ACTIVE_CHOICES = (
    ('Y','Active'),
    ('N','Inactive'),
)

class UserFilters(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=60)
    filter = models.TextField()
    verify_key = models.CharField(max_length=96)
    active = models.CharField(max_length=1,choices=ACTIVE_CHOICES,default='N')
    class Meta:
        db_table = u'user_filters'

class Users(models.Model):
    username = models.CharField(max_length=60, primary_key=True)
    password = models.CharField(max_length=32)
    fullname = models.CharField(max_length=50)
    type = models.CharField(max_length=1,choices=TYPE_CHOICES, default='U')
    quarantine_report = models.IntegerField(null=True, blank=True)
    spamscore = models.IntegerField(null=True, blank=True,default=0)
    highspamscore = models.IntegerField(null=True, blank=True,default=0)
    noscan = models.IntegerField(null=True, blank=True)
    quarantine_rcpt = models.CharField(max_length=60, blank=True)
    class Meta:
        db_table = u'users'
