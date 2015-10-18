import json
import api
import unittest
import tempfile

class <%= appName %>TestCase(unittest.TestCase):

    def setUp(self):
        api.app.config['TESTING'] = True
        self.app = api.app.test_client()

    def load_json(self, data):
        return json.loads(str(data, 'utf-8'))

    def test_get_index(self):
        out = self.app.get('/')
        assert b'data-section="app"' in out.data

if __name__ == '__main__':
    unittest.main()
