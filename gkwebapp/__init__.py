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
    config.add_route('orgexists', '/orgexists')
    config.add_route('findeditvoucher', '/findeditvoucher')
    config.add_route('editvoucher', '/editvoucher')
    config.add_route('createorg', '/createorg')
    config.add_route('yearcode', '/yearcode')
    config.add_route('login', '/login')
    config.add_route('showmainshell', '/showmainshell')
    config.add_route('showviewledger', '/showviewledger')
    config.add_route('showledgerreport', '/showledgerreport')
    config.add_route('showtrialbalance', '/showtrialbalance')
    config.add_route('showtrialbalancereport', '/showtrialbalancereport')
    config.add_route('showcashflow', '/showcashflow')
    config.add_route('showprofitloss', '/showprofitloss')
    config.add_route('showbalancesheet', '/showbalancesheet')
    config.add_route('showbalancesheetreport', '/showbalancesheetreport')
    config.add_route('showcashflowreport', '/showcashflowreport')
    config.add_route('showprofitlossreport', '/showprofitlossreport')
    config.add_route('showviewprojectstatement', '/showviewprojectstatement')
    config.add_route('showprojectstatementreport', '/showprojectstatementreport')
    config.add_route('showaccount', '/showaccount')
    config.add_route('showlistofaccounts', '/showlistofaccounts')
    config.add_route('showmultiacc', '/showmultiacc')
    config.add_route('multiacc', '/multiacc')
    config.add_route('accountexists', '/accountexists')
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
    config.add_route('removeuser', '/removeuser')
    config.add_route('deleteuser', '/deleteuser')
    config.add_route('forgotpassword', '/forgotpassword')
    config.add_route('showclosebooks', '/showclosebooks')
    config.scan('gkwebapp')
    return config.make_wsgi_app()
