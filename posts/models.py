
from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile

# Create your models here.

class Post(models.Model):
  title    = models.CharField(max_length=200)
  body     = models.TextField()
  liked    = models.ManyToManyField(User, blank=True) ### a newly created post may take time to be liked (blank)
  author   = models.ForeignKey(Profile, on_delete=models.CASCADE)
  updated  = models.DateTimeField(auto_now=True)
  created  = models.DateTimeField(auto_now_add=True)

  def __str__(self):
      return str(self.title)

  @property
  def like_count(self):
    return self.liked.all().count()

  def get_photos(self):
    return self.photo_set.all()
  ### this is reverse relationship because we have an instance of the post and we want to find all the photos that are related to it. self refers to any instance of the post and photo is the small letters of Photo. 

  class Meta:
    ordering = ('-created',)


class Photo(models.Model):
  post = models.ForeignKey(Post, on_delete=models.CASCADE)
  image = models.ImageField(upload_to="photos")
  created = models.DateTimeField(auto_now_add=True)

  def __str__(self):
      return f"{ self.post.title } - { self.pk }"
  