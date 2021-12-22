from charData import CharData as cd
from plData import PLData as pd
from datetime import datetime
import tkinter as tk

import logging
LOGGER = logging.getLogger(__name__)
FORMAT = "[%(filename)s:%(lineno)s][%(funcName)20s()] %(message)s"
logging.basicConfig(format=FORMAT)
LOGGER.setLevel(logging.DEBUG)

class Overlay:
    def __init__(self, defaultConfig, displayConfig):
        self.quitNow = False
        self.defaultConfig = defaultConfig
        self.displayConfig = displayConfig
        self.charData = cd(charName=defaultConfig['charName'])
        self.plData = pd(leagueName=defaultConfig['leagueName'])
        self.updateInterval = int(defaultConfig['updateInterval'])

        self.root = tk.Tk()
        self.root.minsize(200, 20)
        self.root.maxsize(1000, 100)
        self.root.geometry(f"+{self.displayConfig['windowPositionX']}+{self.displayConfig['windowPositionY']}")
        self.root.overrideredirect(True)
        self.root.wm_attributes('-topmost', 'true')
        self.root.wm_attributes('-alpha', float(self.displayConfig['windowAlpha'])/100.00)
        
        self.label = tk.Label(self.root, text="No Data Yet")
        self.label.pack()

        # start the timer
        self.label.after(self.updateInterval * 1000, self.refresh_label)

    def refresh_label(self):
        if self.quitNow:
            self.root.quit()
        LOGGER.info('Updating data.')
        self.plData.getRankData()
        self.charData.getCharDataFromRankData(plRankData=self.plData.rankData)
        if not self.charData.charData:
            formattedMessage = 'CHARACTER NOT FOUND OR RANK > 2000'
        else:
            formattedMessage = self.getFormattedMessage()
        self.label.configure(text=formattedMessage)
        
        LOGGER.info('Done Updating data.')
        self.label.after(self.updateInterval * 1000, self.refresh_label)

    def getFormattedMessage(self):
        separator = ' | '
        newLine = '\n'
        if eval(self.displayConfig['showOneLiner']):
            newLine = separator
        formattedMessage = ''
        if eval(self.displayConfig['showGlobalRank']):
            formattedMessage += f'GLOBAL RANK: {self.charData.getGlobalCharRank()}'
        if eval(self.displayConfig['showBaseClassRank']):
            formattedMessage += f'{separator}BASE CLASS RANK: {self.charData.getClassCharRank(plRankData=self.plData.rankData)}'
        if eval(self.displayConfig['showAscendancyRank']):
            formattedMessage += f'{separator}ASCENDANCY RANK: {self.charData.getAscendancyCharRank(plRankData=self.plData.rankData)}'
        if eval(self.displayConfig['showClass']):
            formattedMessage += f'{newLine}CLASS: {self.charData.charData["character"]["class"]}'
        if eval(self.displayConfig['showLevel']):
            formattedMessage += f'{separator}LEVEL: {self.charData.charData["character"]["level"]}'
        if eval(self.displayConfig['showLeagueName']):
            formattedMessage += f'{newLine}LEAGUE: {self.plData.leagueName}'
        if eval(self.displayConfig['showLastUpdatedTime']):
            formattedMessage += f'{newLine}LAST UPDATED: {datetime.now()}'
        return formattedMessage
    
    def quit(self):
        self.quitNow = True
        LOGGER.warn('EXITING..')
        self.root.quit()