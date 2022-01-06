from distutils.core import setup
from setuptools import find_packages
import py2exe
import sys

sys.argv.append('py2exe')

with open('README.md', 'r') as f:
    readme = f.read()

setup(
    name='POE Private League Ranker Overlay',
    version='0.1.1a',
    author='Jessnar Sinues(jezztify)',
    author_email='jessnarsinues@gmail.com',
    long_description=readme,
    url='https://github.com/jezztify/PoE-Pvt-League-Ranker-Overlay',
    packages=find_packages(),
    classifiers= [
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent'
    ],
    requires=[line.strip() for line in open("requirements.txt").readlines()],
    options = {
        'py2exe': {
            'bundle_files': 2, 
            'compressed': True
        }
    },
    py_modules=['pplo/charData', 'pplo/overlay', 'pplo/plData'],
    windows=['pplo/__main__.py']
)