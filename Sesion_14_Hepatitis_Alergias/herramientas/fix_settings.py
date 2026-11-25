# Corrige el orden de <w:autoHyphenation/> en settings.xml (esquema OOXML)
import sys, zipfile, shutil, os
src = sys.argv[1]; tmp = src + '.tmp'
with zipfile.ZipFile(src) as zin, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == 'word/settings.xml':
            s = data.decode('utf-8')
            s = s.replace('<w:evenAndOddHeaders w:val="false"/><w:autoHyphenation/>', '<w:autoHyphenation/><w:evenAndOddHeaders w:val="false"/>')
            data = s.encode('utf-8')
        zout.writestr(item, data)
shutil.move(tmp, src)
print('settings.xml corregido')
