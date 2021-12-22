import json
from pplo.charData import CharData as cd

class TestCharData:
    def setup_class(cls):
        cls.charData = cd(charName = 'ShadowsAreSquishyLUL')
        with open('test/mockData/rankData.json', 'r') as f:
            cls.plRankData = json.load(f)
    
    def test_getCharDataFromRankData_should_return_correct_data(self):
        self.charData.getCharDataFromRankData(self.plRankData)
        expected_result = {
            'rank': 20, 
            'dead': True, 
            'public': True, 
            'character': {
                'id': 'db7094e3a9c1ced147e9887dfa6c6b931f29bcdd287438d2d7f1dfeef1aef5c1', 
                'name': 'ShadowsAreSquishyLUL', 
                'level': 84, 
                'class': 'Assassin', 
                'experience': 1208345293, 
                'depth': {
                    'default': 69, 
                    'solo': 69
                }
            }, 
            'account': {
                'name': 'jezztify04', 
                'realm': 'pc', 
                'challenges': {
                    'total': 17
                }, 
                'twitch': {
                    'name': 'lovecontagion'
                }
            }
        }
        assert(self.charData.charData == expected_result)
    
    def test_getGlobalCharRank_should_return_correct_global_rank(self):
        self.charData.getCharDataFromRankData(self.plRankData)
        expected_result = 20
        assert(self.charData.getGlobalCharRank() == expected_result)

    def test_getClassCharRank_should_return_correct_class_rank(self):
        self.charData.getCharDataFromRankData(self.plRankData)
        expected_result = 3
        assert(self.charData.getClassCharRank(self.plRankData) == expected_result)

    def test_getAscendancyCharRank_should_return_correct_ascendancy_rank(self):
        self.charData.getCharDataFromRankData(self.plRankData)
        expected_result = 1
        assert(self.charData.getAscendancyCharRank(self.plRankData) == expected_result)