import json
import requests
import sys
from time import sleep
from urllib.parse import urlparse, parse_qs

import logging
LOGGER = logging.getLogger(__name__)
FORMAT = "[%(filename)s:%(lineno)s][%(funcName)20s()] %(message)s"
logging.basicConfig(filename='main.log', format=FORMAT)
LOGGER.addHandler(logging.StreamHandler(sys.stdout))
LOGGER.setLevel(logging.DEBUG)

class PLData:
    def __init__(self, url=None, leagueName=None):
        self.leagueName = None
        if url:
            parsedURL = urlparse(url)
            parsedQueries = parse_qs(parsedURL.query)
            self.leagueName = parsedQueries['id'][0]
        if leagueName:
            self.leagueName = leagueName
        if(not self.leagueName):
            raise Exception('InitError', 'league url or league name should be provided')
        self.poeLadderUrl = 'https://www.pathofexile.com/api/ladders' 
        self.rankData = None

    def getRankData(self):
        url_params = {
            'offset': 0,
            'id': self.leagueName
        }
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0'
        }
        finalRankData = {}
        count = 1
        totalPages = 0
        currentPage = 0
        while True:
            try:
                LOGGER.info(f'Fetching Data.. {count}')
                thisRankData = requests.get(
                    url=self.poeLadderUrl,
                    params = url_params,
                    timeout = 2,
                    headers = headers
                )
                thisRankData = json.loads(thisRankData.text)
                if(totalPages == 0):
                    if(int(thisRankData['total'] / 200) > 10):
                        totalPages = 10
                if('entries' not in finalRankData.keys()):
                    finalRankData = thisRankData
                else:
                    if('entries' in thisRankData.keys()):
                        finalRankData['entries'] += thisRankData['entries']
                
                currentPage += 1
                # STOP PROCESSING DATA IF PAGES GO BEYOND 10 PAGES OF 200 ITEMS EACH
                # TOTAL OF 2000 DATA POINTS, HENCE RANK IS GREATER THAN 2000
                if(currentPage + 1 > 10 or
                    len(thisRankData['entries']) == 0 or 
                    len(thisRankData['entries']) == thisRankData['total']
                    ):
                    LOGGER.info('Done Fetching Data.')
                    break
                if(len(finalRankData['entries']) < thisRankData['total']):
                    url_params['offset'] = currentPage * 200
                sleep(2)
                count += 1
            except Exception as e:
                LOGGER.info(f'ERROR: {e}')
                sleep(2)
                continue
        self.rankData = finalRankData



