import configparser
from time import sleep
from overlay import Overlay as ov
from system_hotkey import SystemHotkey, SystemRegisterError, InvalidKeyError
import logging
import sys
LOGGER = logging.getLogger(__name__)
FORMAT = "[%(filename)s:%(lineno)s][%(funcName)s()] %(message)s"
logging.basicConfig(format=FORMAT)
LOGGER.setLevel(logging.DEBUG)
if __name__ == "__main__":
    print('POE Private League Overlay')
    config = configparser.ConfigParser()
    config.read('config.ini')
    print('--------- CONFIG ---------')
    with open('config.ini') as f:
        [print(line) for line in f.read().splitlines() if '#' not in line]
    defaultConfig = config['DEFAULT']
    displayConfig = config['DISPLAY']
    print('--------- CONFIG ---------')
    
    overlay = ov(defaultConfig, displayConfig)
    hk = SystemHotkey()
    hk.register(defaultConfig['exitKeys'].split(' '), callback=lambda event: overlay.quit())
    hk.parse_hotkeylist(defaultConfig['exitKeys'].split(' '))
    overlay.root.mainloop()

