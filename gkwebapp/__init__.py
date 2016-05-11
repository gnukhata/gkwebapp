from pyramid.config import Configurator
from gkwebapp.resources import get_root


def main(global_config, **settings):
    """ This function returns a WSGI application.

    It is usually called by the PasteDeploy framework during
    ``paster serve``.
    """
    settings = dict(settings)
    settings.setdefault('jinja2.i18n.domain', 'gkwebapp')

    config = Configurator(root_factory=get_root, settings=settings)
    config.add_translation_dirs('locale/')
    config.include('pyramid_jinja2')

    config.add_static_view('static', 'static')
    config.add_view('gkwebapp.views.views.my_view',
                    context='gkwebapp.resources.MyResource',
                    renderer="templates/mytemplate.jinja2")
    config.add_route('index', '/')
    config.add_route('about', '/about')
    config.add_route('existingorg', '/existingorg')
    config.add_route('findeditvoucher', '/findeditvoucher')
    config.add_route('editvoucher', '/editvoucher')
    config.add_route('createorg', '/createorg')
    config.add_route('yearcode', '/yearcode')
    config.add_route('login', '/login')
    config.add_route('showmainshell', '/showmainshell')
    config.add_route('showaccount', '/showaccount')
    config.add_route('accountpopup', '/accountpopup')
    config.add_route('showvoucher', '/showvoucher')
    config.add_route('showproject', '/showproject')
    config.add_route('viewproject', '/viewproject')
    config.add_route('editproject', '/editproject')
    config.add_route('addproject', '/addproject')
    config.add_route('delproject', '/delproject')
    config.add_route('lockvoucher', '/lockvoucher')
    config.add_route('viewvoucher', '/viewvoucher')
    config.add_route('addvoucher', '/addvoucher')
    config.add_route('showeditaccount', '/showeditaccount')
    config.add_route('getaccdetails', '/getaccdetails')
    config.add_route('getvouchers', '/getvouchers')
    config.add_route('getcjaccounts', '/getcjaccounts')
    config.add_route('showuser', '/showuser')
    config.add_route('createuser', '/createuser')
    config.add_route('addaccount', '/addaccount')
    config.add_route('editaccount', '/editaccount')
    config.add_route('deleteaccount', '/deleteaccount')
    config.add_route('getsubgroup','/getsubgroup')
    config.add_route('createorglogin','/createorglogin')
    config.add_route('userlogin','/userlogin')
    config.add_route('createadmin', '/createadmin')
    config.scan('gkwebapp')
    return config.make_wsgi_app()
