import urllib2
#import ast
import csv

f = open('billboard2.csv', 'wt')
writer = csv.writer(f)
writer.writerow( ('Song', 'Artist', 'Weeks On', 'Peak', 'Rank', 'Date') )
keys = ['bvk4re5h37dzvx87h7rf5dqz', '4cjuqaqg22farqnch44pbvr4']
keyIdx = 0
url = 'http://api.billboard.com/apisvc/chart/v1/list?id=379&sdate=1-10-10&edate=2011-10-30&format=json&api_key=' + keys[keyIdx]
#num = 271237/50 + 1;
start = 1
k = 0 #dummy var
while (True):
	try:
		url2 = url + '&start=' + str(start)
		data = eval(urllib2.urlopen(url2).read())
		data = data['searchResults']['chartItem']
		if len(data) == 0:
			break
		for d in data:
			writer.writerow( (d['song'], d['artist'], d['weeksOn'], d['peak'], d['rank'], d['chart']['issueDate']) )
		start = start + 50
		if ((start-1)%1000 == 0):
			print "1"
	except Exception:
		k
