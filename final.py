import csv
import re
import random

f = open('bb.csv', 'rb')
f2 = open('billboardHot.csv', 'wt')

reader = csv.reader(f)
writer = csv.writer(f2)
writer.writerow( ('song', 'artist', 'weeks', 'peak', 'year', 'genre') )

years = {}
gens = [(['Jazz'], 'Jazz'),
	(['Funk'], 'Funk'),
	(['Hip hop', 'Gangsta rap', 'Rap'], 'Hip hop/Rap'),
	(['Heavy metal music', 'Hard rock'], 'Heavy metal'),
	(['Soul music'], 'Soul'),
	(['Dance music', 'Dance-pop'], 'Dance'),
	(['Alternative rock'], 'Alternative rock'),
	(['Contemporary R&B','Rhythm and blues'], 'Rhythm and blues (R&B)'),
	(['Rock music'], 'Rock'),
	(['Pop music'], 'Pop'),
	(['Country music'], 'Country')]

i = 0
for row in reader:
	if i:
		p = re.compile('-.*$')
		year = p.sub('', row[5])
		if not years.has_key(year):
			data = {}
		else:
			data = years[year]
			
		song = row[0]
		artist = row[1]
		key = song + artist
		if data.has_key(key):
			info = data[key]
			info["weeks"] = info["weeks"] + 1
			rank = int(row[4])
			if rank < info["peak"]:
				info["peak"] = rank
			data[key] = info
		else:
			data[key] = { "weeks": 1, "peak": int(row[4]) }
		years[year] = data
	else:
		i = 1
f.seek(0)
i = 0
cache = {}
for row in reader:
	if i:
		random.shuffle(gens)
		song = row[0]
		artist = row[1]
		key = song + artist
		p = re.compile('-.*$')
		year = p.sub('', row[5])
		genres = row[6].split('|')
		genre = 'Other'
		for g in gens:
			for j in g[0]:
				for k in genres:
					if k == j:
						genre = g[1]
						break
				if genre != 'Other':
					break
			if genre != 'Other':
				break
		data = years[year][key]
		if not cache.has_key(artist + song + year):
			writer.writerow( (song, artist, data['weeks'], data['peak'], year, genre) )
			cache[artist + song + year] = '1'
	else:
		i = 1