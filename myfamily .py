myfamily = {
    "child1": {"name": "Emil", "thing": {"year": 2004}},
    "child2": {"name": "Tobias", "thing": {"year": 2002}},
    "child3": {"name": "Linus", "thing": {"year": 2004}},
    "child4": {"name": "Linus", "thing": {"year": 20011}},
    "child5": {"name": "Linus", "thing": {"year": 20046}},
    "child6": {"name": "Linus", "thing": {"year": 20011}},
}

for x in myfamily:
    myfamily[x]["thing"]["year"] = 10
