import configparser
from time import sleep
from overlay import Overlay as ov
from system_hotkey import SystemHotkey, SystemRegisterError, InvalidKeyError
import sys

import logging
LOGGER = logging.getLogger(__name__)
FORMAT = "[%(filename)s:%(lineno)s][%(funcName)s()] %(message)s"
logging.basicConfig(filename='main.log', format=FORMAT)
LOGGER.addHandler(logging.StreamHandler(sys.stdout))
LOGGER.setLevel(logging.DEBUG)

if __name__ == "__main__":
    LOGGER.info('POE Private League Overlay')
    try:
        config = configparser.ConfigParser()
        config.read('config.ini')
        LOGGER.info('--------- CONFIG ---------')
        with open('config.ini') as f:
            [LOGGER.info(line) for line in f.read().splitlines() if '#' not in line]
        LOGGER.info('--------- CONFIG ---------')
    except Exception as e:
        LOGGER.error(e)
        sys.exit()
    defaultConfig = config['DEFAULT']
    displayConfig = config['DISPLAY']
    
    overlay = ov(defaultConfig, displayConfig)
    hk = SystemHotkey()
    hk.register(defaultConfig['exitKeys'].split(' '), callback=lambda event: overlay.quit())
    hk.parse_hotkeylist(defaultConfig['exitKeys'].split(' '))
    overlay.root.mainloop()

