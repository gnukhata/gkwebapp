
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
This file is part of GNUKhata:A modular,robust and Free Accounting System.

GNUKhata is Free Software; you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation; either version 3 of
the License, or (at your option) any later version.and old.stockflag = 's'

GNUKhata is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with GNUKhata (COPYING); if not, write to the
Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Krishnakant Mane" <kk@dff.org.in>
"Arun Kelkar" <arunkelkar@dff.org.in>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Vaibhav Kurhe" <vaibspidy@openmailbox.org>
"Vanita Rajpurohit" <vanita.rajpurohit9819@gmail.com>
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"""

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

<<<<<<< 278bc76137d7ff6d70a5798c4380722e9db0beef
	config.add_static_view('static', 'static')
	config.add_view('gkwebapp.views.views.my_view',
					context='gkwebapp.resources.MyResource',
					renderer="templates/mytemplate.jinja2")
	config.add_route('index', '/')
	config.add_route('about', '/about')
	config.add_route('existingorg', '/existingorg')
	config.add_route('showeditOrg', '/showeditOrg')
	config.add_route('showedituser', '/showedituser')
	config.add_route('getorgcode','/getorgcode')
	config.add_route('edituser','/edituser')
	config.add_route('editorganisation', '/editorganisation')
	config.add_route('orgexists', '/orgexists')
	config.add_route('findeditvoucher', '/findeditvoucher')
	config.add_route('editvoucher', '/editvoucher')
	config.add_route('createorg', '/createorg')
	config.add_route('yearcode', '/yearcode')
	config.add_route('login', '/login')
	config.add_route('updaterecon', '/updaterecon')
	config.add_route('orgdata', '/orgdata')
	config.add_route('closebooks', '/closebooks')
	config.add_route('deletevoucher', '/deletevoucher')
	config.add_route('showmainshell', '/showmainshell')
	config.add_route('showviewledger', '/showviewledger')
	config.add_route('showviewbankrecon', '/showviewbankrecon')
	config.add_route('showunclearedbankrecon', '/showunclearedbankrecon')
	config.add_route('viewdualledger', '/viewdualledger')
	config.add_route('showdualledgerreport', '/showdualledgerreport')
	config.add_route('showclearedbankrecon', '/showclearedbankrecon')
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
	config.add_route('updateattachment', '/updateattachment')
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
	config.add_route('rollover', '/rollover')
	config.add_route('printlistofaccounts', '/printlistofaccounts')
	config.add_route('printsourcesandappfundreport', '/printsourcesandappfundreport')
	config.add_route('printconvbalsheetreport', '/printconvbalsheetreport')
	config.add_route('printmonthlyledgerreport', '/printmonthlyledgerreport')
	config.add_route('printprojectstatementreport', '/printprojectstatementreport')
	config.add_route('printprofitandloss', '/printprofitandloss')
	config.add_route('printledgerreport', '/printledgerreport')
	config.add_route('printtrialbalance', '/printtrialbalance')
	config.add_route('printcashflowreport', '/printcashflowreport')
	config.add_route('showdeletedvoucher', '/showdeletedvoucher')
	config.add_route('deleteorg', '/deleteorg')
	config.add_route('getattachment', '/getattachment')
	config.scan('gkwebapp')
	return config.make_wsgi_app()
=======
    config.add_static_view('static', 'static')
    config.add_view('gkwebapp.views.views.my_view',
    context='gkwebapp.resources.MyResource',
    renderer="templates/mytemplate.jinja2")
    config.add_route('index', '/')
    config.add_route('about', '/about')
    config.add_route('existingorg', '/existingorg')
    config.add_route('showeditOrg', '/showeditOrg')
    config.add_route('showedituser', '/showedituser')
    config.add_route('getorgcode','/getorgcode')
    config.add_route('edituser','/edituser')
    config.add_route('editorganisation', '/editorganisation')
    config.add_route('orgexists', '/orgexists')
    config.add_route('findeditvoucher', '/findeditvoucher')
    config.add_route('editvoucher', '/editvoucher')
    config.add_route('createorg', '/createorg')
    config.add_route('yearcode', '/yearcode')
    config.add_route('login', '/login')
    config.add_route('updaterecon', '/updaterecon')
    config.add_route('orgdata', '/orgdata')
    config.add_route('closebooks', '/closebooks')
    config.add_route('deletevoucher', '/deletevoucher')
    config.add_route('showmainshell', '/showmainshell')
    config.add_route('showviewledger', '/showviewledger')
    config.add_route('showviewbankrecon', '/showviewbankrecon')
    config.add_route('showunclearedbankrecon', '/showunclearedbankrecon')
    config.add_route('viewdualledger', '/viewdualledger')
    config.add_route('showdualledgerreport', '/showdualledgerreport')
    config.add_route('showclearedbankrecon', '/showclearedbankrecon')
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
    config.add_route('rollover', '/rollover')
    config.add_route('printlistofaccounts', '/printlistofaccounts')
    config.add_route('printsourcesandappfundreport', '/printsourcesandappfundreport')
    config.add_route('printconvbalsheetreport', '/printconvbalsheetreport')
    config.add_route('printmonthlyledgerreport', '/printmonthlyledgerreport')
    config.add_route('printprojectstatementreport', '/printprojectstatementreport')
    config.add_route('printprofitandloss', '/printprofitandloss')
    config.add_route('printledgerreport', '/printledgerreport')
    config.add_route('printtrialbalance', '/printtrialbalance')
    config.add_route('printcashflowreport', '/printcashflowreport')
    config.add_route('showdeletedvoucher', '/showdeletedvoucher')
    config.add_route('deleteorg', '/deleteorg')
    config.add_route('userdetails', '/userdetails')
    config.add_route('securityquestion', '/securityquestion')
    config.scan('gkwebapp')
    return config.make_wsgi_app()
>>>>>>> Displayed security question in forgotpassword page
