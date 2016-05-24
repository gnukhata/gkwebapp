from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showclosebooks", renderer="gkwebapp:templates/closebooks.jinja2")
def showclosebooks(request):
    return {"a":1}
