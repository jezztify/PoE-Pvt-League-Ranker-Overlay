
import requests
import json

class LeagueData:
    def __init__(self, leagueName, logger=None,poeLadderApi=None):
        self.LOGGER = logger
        self.leagueName = leagueName
        self.poeLadderApi = 'https://www.pathofexile.com/api/ladders/' 
        if poeLadderApi:
            self.poeLadderApi = poeLadderApi
        self.leagueRankData = None

    def getLeagueData(self, pageOffset=0, accountName=None, classId=None):
        url_params = {
            'offset': pageOffset,
            'limit': 200,
        }
        if accountName:
            url_params['accountName'] = accountName
        if classId:
            url_params['class'] = classId

        if(accountName and classId):
            self.LOGGER.warn('filtering accountName and classId may cause no results at all.')

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0'
        }

        self.LOGGER.info(f'Fetching Data.. [Page Offset: {pageOffset}]')
        resp = requests.get(
            url=self.poeLadderApi + self.leagueName,
            params = url_params,
            timeout = 2,
            headers = headers
        )
        self.leagueRankData = json.loads(resp.text)
        # print(self.leagueRankData)
        return self.leagueRankData
