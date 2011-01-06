# 
# Baruwa - Web 2.0 MailScanner front-end.
# Copyright (C) 2010-2011  Andrew Colin Kissa <andrew@topdog.za.net>
# 
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
#
# vim: ai ts=4 sts=4 et sw=4
#

"Exim queue parser"
import os
import subprocess
import codecs

from datetime import datetime
from baruwa.utils.regex import SUBJECT_RE, MSGLOG_RE
import fcntl

class QueueParser(object):
    "Exim queue parser"
    
    def __init__(self, queue):
        "init"
        self.qdir = queue
        self.items = []

    def process(self):
        "process"
        def getheaders(matched, dirname, files):
            "utility to get queue header files"
            matched.extend([os.path.join(dirname, filename) 
                            for filename in files 
                            if filename.endswith('-H')])
        
        def getsubject(lines):
            "Get the subject"
            subject = ''
            line = None
            for val in lines:
                match = SUBJECT_RE.match(val)
                if match:
                    line = match.groups()[0].strip()
                    break
            if line:
                subject = line
            return subject
        
        def getrecipients(lines):
            "Get the recipients"
            lines.reverse()
            recipients = []
            for line in lines:
                if line.strip().isdigit():
                    break
                recipients.append(line.strip())
            return recipients 
                            
        def extractinfo(path):
            "extract attributes from queue file"
            try:
                headerfile = codecs.open(path, 'r', 'utf-8')
                fcntl.flock(headerfile, fcntl.LOCK_EX)
                lines = headerfile.readlines()
                fcntl.flock(headerfile, fcntl.LOCK_UN)
                headerfile.close()
                index = lines.index('\n')
                attribs = {}
                attribs['messageid'] = lines[0][:-3]
                timestamp = str(datetime.fromtimestamp(
                            float(lines[3].split()[0])))
                attribs['timestamp'] = timestamp
                attribs['lastattempt'] = timestamp
                attribs['from_address'] = lines[2].lstrip('<').rstrip('>\n')
                attribs['to_address'] = getrecipients(lines[:index])
                attribs['subject'] = getsubject(lines[index:])
                pipe1 = subprocess.Popen('hostname', shell=True, 
                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                attribs['hostname'] = pipe1.stdout.read().strip()
                dpath = os.path.join(os.path.dirname(path), 
                        os.path.basename(path).replace('-H', '-D'))
                replace = path.split(os.sep)[-2]
                mpath = os.path.join(
                        os.path.dirname(path.replace(replace, 'msglog')), 
                        os.path.basename(path).rstrip('-H'))
                attribs['size'] = (os.path.getsize(path) + 
                                    os.path.getsize(dpath))
                attribs['attempts'] = 0
                try:
                    msglog = codecs.open(mpath, 'r', 'utf-8')
                    for msg in msglog:
                        match = MSGLOG_RE.match(msg)
                        if match:
                            attribs['attempts'] += 1
                            attribs['lastattempt'] = match.groups()[0]
                    msglog.close()
                except:
                    pass
                return attribs
            except:
                return None
            
        queuefiles = []
        os.path.walk(self.qdir, getheaders, queuefiles)
        results = [extractinfo(path) for path in queuefiles]
        self.items = [result for result in results if not result is None]
        return self.items