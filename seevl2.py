import urllib2
import urllib
import csv
import re

appId = 'ddd9dd54'
appKey = '64a3b7d9ab71e01b4086d9f7f9034ee1'

f = open('billboard.csv', 'rb')
f2 = open('bb.csv', 'at')
f3 = open('genre.csv', 'rb')
writer = csv.writer(f2)
writer.writerow( ('Song', 'Artist', 'Weeks On', 'Peak', 'Rank', 'Date', 'Genre') )
reader = csv.reader(f)
greader = csv.reader(f3)
#reader = reader.next()
cache = {}

i = 0
for row in greader:
	if i:
		artist = row[0]
		genre = row[1]
		cache[artist] = genre
	i = 1 

i = 0
for row in reader:
	if i > 161586:
		artist = row[1]
		p = re.compile('((\()*Featuring.*$|(\()*With.*$|(\()*Duet.*$)')
		artist = p.sub('', artist)
		artist = artist.rstrip()
		artist = urllib.quote_plus(artist)
		if cache.has_key(artist):
			genre = cache[artist]
		else:
			request = urllib2.Request('http://data.seevl.net/entity/?prefLabel=' + artist, headers = 
				{'Accept': 'application/json', 'X_APP_ID': appId, 'X_APP_KEY':appKey})
			try:	
				data = eval(urllib2.urlopen(request).read())
				id = data["results"][0]["id"]
				request = urllib2.Request('http://data.seevl.net/entity/' + id + '/facts', headers =
                                	{'Accept': 'application/json', 'X_APP_ID': appId, 'X_APP_KEY':appKey})
				data = eval(urllib2.urlopen(request).read())
				genres = data["genre"]
				genre = ''
				for j in range(len(genres)):
					if j > 0:
						genre = genre + '|'
					genre = genre + genres[j]["prefLabel"]
					cache[artist] = genre
			except Exception:
				genre = 'NULL'
		writer.writerow( (row[0], row[1], row[2], row[3], row[4], row[5], genre) )
	i = i + 1
	if (i%10000 == 0):
		f2.flush()

