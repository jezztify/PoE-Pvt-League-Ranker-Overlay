from leagueData import LeagueData
import logger
from jsonpath_ng.ext import parse

LOGGER = logger.initialize()

class CharData(LeagueData):
    def __init__(self, accountName, leagueName, charName, poeLadderApi=None):
        super().__init__(leagueName=leagueName, logger=LOGGER, poeLadderApi=poeLadderApi)
        self.accountName = accountName
        self.charName = charName
        self.charData = None

    def getCharRankData(self, type='league'):
        if(type == 'league'):
            return self._getLeagueRankData()

    def _getLeagueRankData(self):
        leagueData = self.getLeagueData(accountName=self.accountName)
        if('account' in leagueData['entries'][0]):
            msg = f'account {self.accountName} not found. Please recheck settings'
            self.LOGGER.warn(msg)
            return msg
        jpExpr = parse(f"$.entries[?(@.character.name == '{self.charName}')]")
        foundValues = [match.value for match in jpExpr.find(leagueData)]
        if foundValues:
            self.charData = foundValues[0]
        else:
            msg = f'character {self.charName} not found. Please recheck settings'
            self.LOGGER.warn(msg)
            return msg
        return self.charData

