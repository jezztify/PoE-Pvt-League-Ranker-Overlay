import sys
import logging

def initialize():
    LOGGER = logging.getLogger(__name__)
    FORMAT = "[%(filename)s:%(lineno)s][%(funcName)s()] %(message)s"
    logging.basicConfig(filename='main.log', format=FORMAT)
    LOGGER.addHandler(logging.StreamHandler(sys.stdout))
    LOGGER.setLevel(logging.DEBUG)
    return LOGGER
