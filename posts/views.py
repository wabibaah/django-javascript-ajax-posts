
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

def load_posts_data_view(request, num_posts):
  visible = 3
  upper = num_posts
  lower = upper  - visible
  size = Post.objects.all().count()

  qs = Post.objects.all()
  # data = serializers.serialize("json", qs)
  data = []
  for post in qs:
    item = {
      "id": post.id,
      "title": post.title,
      "body": post.body,
      "liked": True if request.user in post.liked.all() else False,
      "count": post.like_count,
      "author": post.author.user.username
    }
    data.append(item)
  # print(data)
  return JsonResponse({'data': data[lower:upper], 'size': size})


def like_unlike_posts(request):
  if request.is_ajax():
    pk = request.POST.get("pk")
    obj = Post.objects.get(pk=pk)

    if request.user in obj.liked.all():
      liked = False
      obj.liked.remove(request.user)
      # we are actually dealing with user here and not boolean values

    else:
      liked = True
      obj.liked.add(request.user)
    return JsonResponse({
      'liked': liked,
      "count": obj.like_count
    })

def hello_world(request):
  return JsonResponse({'text': "Hellow world from the views in JsonResponse"})