
from django.shortcuts import render
from . models import Post
from . forms import PostForm
from profiles.models import Profile
from django.http import JsonResponse
# from django.core import serializers

# Create your views here.

def post_list_and_create(request):
  form = PostForm(request.POST or None)
  # qs = Post.objects.all()  ### now we are using ajax request so we don't need this anymore

  if request.is_ajax():
    if form.is_valid():
      author = Profile.objects.get(user=request.user)
      instance = form.save(commit=False)
      # we cannot save the form yet, without the author who created it, so commit = False
      instance.author = author
      # this is to make sure the author really has a profile, because we could have just set it to request.user
      instance.save()

      return JsonResponse({
        'title': instance.title,
        'body': instance.body,
        'author': instance.author.user.username,
        'id': instance.id,
      })

  cxt = {
    # 'qs': qs,
    'form': form,
  }
  return render(request, 'posts/main.html', cxt )


def post_detail(request, pk):
  obj = Post.objects.get(pk=pk)
  form = PostForm()

  context = {
    'obj': obj,
    'form': form,
  }

  return render(request, 'posts/detail.html', context)



def load_posts_data_view(request, num_posts):
  if request.is_ajax():
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



def post_detail_data_view(request, pk):
  obj = Post.objects.get(pk = pk)
  data = {
    'id': obj.id,
    'title': obj.title,
    'body': obj.body,
    'author': obj.author.user.username,
    'logged_in': request.user.username,
  }

  return JsonResponse({'data': data})


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

def update_post(request, pk):
  obj = Post.objects.get(pk = pk)

  if request.is_ajax():
    new_title = request.POST.get("title")
    new_body = request.POST.get("body")

    obj.title = new_title
    obj.body = new_body

    obj.save()
  return JsonResponse({
    'title': new_title,
    'body': new_body,
  })

def delete_post(request, pk):
  obj = Post.objects.get(pk = pk)
  if request.is_ajax():
    obj.delete()

  return JsonResponse({})

def hello_world(request):
  return JsonResponse({'text': "Hellow world from the views in JsonResponse"})