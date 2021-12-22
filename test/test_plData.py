import json
import pytest
from unittest import mock
from pplo.plData import PLData as pd

mock_rankData = None
with open('test/mockData/rankData.json') as f:
    mock_rankData = json.load(f)

def mock_get(*args, **kwargs):
    mock_text = mock.MagicMock()
    mock_text.text = json.dumps(mock_rankData)
    return mock_text

class TestPLData:
    def test_PLData_init_with_url(self):
        plData = pd(url = 'https://www.pathofexile.com/api/ladders?offset=200&limit=200&id=Forever+Exiled+HCSSF+Scourge+(PL19601)')
        assert(plData.leagueName == 'Forever Exiled HCSSF Scourge (PL19601)')

    def test_PLData_init_with_leagueName(self):
        leagueName = 'this League Name'
        plData = pd(leagueName=leagueName)
        assert(plData.leagueName == leagueName)

    def test_PLData_without_url_or_leagueName(self):
        with pytest.raises(Exception, match=r'league.*url.*name'):
            pd()

    @mock.patch('requests.get', side_effect=mock_get)
    def test_getRankData(self, mock_get):
        plData = pd(url = 'https://www.pathofexile.com/api/ladders?offset=200&limit=200&id=Forever+Exiled+HCSSF+Scourge+(PL19601)')
        plData.getRankData()
        assert(plData.rankData == mock_rankData)
