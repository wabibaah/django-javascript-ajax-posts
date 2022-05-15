from dataclasses import fields
from django import forms
from . models import Post

class PostForm(forms.ModelForm):
  class Meta:
    model = Post
    fields = ('title', 'body',)

  ### if i don't want to use crispy forms {{form.as_p}}
  # title = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
  # body = forms.CharField(widget=forms.Textarea(attrs={"class": "form-control", "rows": 3 }))