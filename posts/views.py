
from django.shortcuts import render
from . models import Post
from django.http import JsonResponse
# from django.core import serializers

# Create your views here.

def post_list_and_create(request):
  qs = Post.objects.all()
  cxt = {
    'qs': qs
  }
  return render(request, 'posts/main.html', cxt )

def load_posts_data_view(request):
  qs = Post.objects.all()
  # data = serializers.serialize("json", qs)
  data = []
  for post in qs:
    item = {
      "id": post.id,
      "title": post.title,
      "body": post.body,
      "author": post.author.user.username
    }
    data.append(item)
  # print(data)
  return JsonResponse({'data': data})


def hello_world(request):
  return JsonResponse({'text': "Hellow world from the views in JsonResponse"})