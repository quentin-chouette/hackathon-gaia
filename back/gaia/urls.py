from .views import PromptAPI
from django.urls import path


urlpatterns = [ path("prompt/",PromptAPI.as_view(),name="prompt")]