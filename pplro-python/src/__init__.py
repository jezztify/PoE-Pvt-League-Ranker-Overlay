from jinja2 import Environment, PackageLoader
# import os
j2env = Environment(loader=PackageLoader('html', 'templates'))
# print(j2env.get_template('rank.html'))
# j2env.from_string(open(os.path.join(os.path.dirname(__file__), 'templates', 'test.j2')).read())
# import sys
# sys.exit()