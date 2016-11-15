
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
"Abhijith Balan" <abhijithb21@openmailbox.org>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import base64
import os, shutil

@view_config(route_name="backupfile", renderer="")
def backup(request):
	header={"gktoken":request.headers["gktoken"]}
	backupdata = requests.get("http://127.0.0.1:6543/backuprestore?fulldb=1", headers=header)
	backup = backupdata.json()["gkdata"]
	backup_str = base64.b64decode(backup)
	backupfile = open("backup.tar","w")
	backupfile.write(backup_str)
	backupfile.close()
	backupfile = open("backup.tar","r")
	bf = backupfile.read()
	backupfile.close()
	headerList = {'Content-Type':'application/x-tar' ,'Content-Length': len(bf),'Content-Disposition': 'attachment; filename=backup.tar', 'Set-Cookie':'fileDownload=true; path=/'}
	os.remove("backup.tar")
	return Response(bf, headerlist=headerList.items())

@view_config(route_name="recoveryfile", renderer="json")
def recover(request):
	try:
		recovery = request.POST["file"].file
		file_path = os.path.join('/tmp', 'recoverydata.tar')
		temp_file_path = file_path + '~'
		recovery.seek(0)
		with open(temp_file_path, 'wb') as recoverydata:
			shutil.copyfileobj(recovery, recoverydata)
		os.rename(temp_file_path, file_path)
		recoveryfile = open("/tmp/recoverydata.tar","r")
		recovery_str = base64.b64encode(recoveryfile.read())
		recoveryfile.close()
		gkdata = {"datasource":recovery_str}
		result = requests.post("http://127.0.0.1:6543/backuprestore",data=json.dumps(gkdata))
		if result.json()["gkstatus"]==0:
			return {"gkstatus":result.json()["gkstatus"]}
			os.remove("recovery.tar")
		else:
			return {"gkstatus":result.json()["gkstatus"]}
	except:
		print "file not found"
		return {"gkstatus":False}
