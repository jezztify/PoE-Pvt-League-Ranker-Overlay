import sys
import json
import operator
from jsonpath_ng.ext import parse

import logging
LOGGER = logging.getLogger(__name__)
FORMAT = "[%(filename)s:%(lineno)s][%(funcName)s()] %(message)s"
logging.basicConfig(filename='main.log', format=FORMAT)
LOGGER.addHandler(logging.StreamHandler(sys.stdout))
LOGGER.setLevel(logging.DEBUG)

class CharData:
    def __init__(self, charName):
        try:
            with open('pplo/data/classes.json') as f:
                self.classData = json.load(f)
        except Exception as e:
            LOGGER.error(e)
            sys.exit()
        self.charName = charName
        self.charData = None

    def getCharDataFromRankData(self, plRankData):
        jpExpr = parse(f"$.entries[?(@.character.name == '{self.charName}')]")
        foundValues = [match.value for match in jpExpr.find(plRankData)]
        if foundValues:
            self.charData = foundValues[0]

    def getGlobalCharRank(self):
        self.globalRank = self.charData['rank']
        return self.charData['rank']

    def getClassCharRank(self, plRankData):
        className = self.charData['character']['class']
        baseClass = [ thisClass for thisClass in self.classData if className in self.classData[thisClass] ][0]
        relatedClasses = self.classData[baseClass]
        classRanks = []
        for rc in relatedClasses:
            jpExpr = parse(f"$.entries[?(@.character.class == {rc})]")
            foundValues = [match.value for match in jpExpr.find(plRankData)]
            classRanks += foundValues
        classRanks.sort(key=operator.itemgetter('rank'))
        self.classRank = next((index for (index, d) in enumerate(classRanks) if d['character']['name'] == self.charName), None) + 1
        return self.classRank
    
    def getAscendancyCharRank(self, plRankData, ascendancy=None):
        if(ascendancy == None):
            ascendancy = self.charData['character']['class']
        jpExpr = parse(f"$.entries[?(@.character.class == {ascendancy})]")
        classRanks = [match.value for match in jpExpr.find(plRankData)]
        ascendancyRank = next((index for (index, d) in enumerate(classRanks) if d['character']['name'] == self.charName), None) + 1       
        if(ascendancy == None):
            self.ascendancyRank = ascendancyRank
        return ascendancyRank