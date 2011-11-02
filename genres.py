import re
import csv
import urllib

f = open('bb.csv', 'rb')
f2 = open('genre.csv', 'wt')

writer = csv.writer(f2)
writer.writerow( ('Artist', 'Genre') )
reader = csv.reader(f)
cache = {}
i = 0
for row in reader:
        if i:
		artist = row[1]
		p = re.compile('((\()*Featuring.*$|(\()*With.*$|(\()*Duet.*$)')
		artist = p.sub('', artist)
                artist = artist.rstrip()
                artist = urllib.quote_plus(artist)
		genre = row[6] if len(row) > 6 else  'NULL'
		if (genre != 'NULL'):
			cache[artist] = genre
	i = 1
for artist in cache:
	writer.writerow( (artist, cache[artist]) )
