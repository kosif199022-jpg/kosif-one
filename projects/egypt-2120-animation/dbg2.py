from playwright.sync_api import sync_playwright
from pathlib import Path
HERE = Path(__file__).resolve().parent
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge", headless=True)
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto((HERE / "index.html").as_uri() + "?capture=1"); pg.wait_for_function("window.__ready === true", timeout=120000)
    names = pg.evaluate("""() => { const L = []; window.__S.S5.scene.traverse(o => { if (o.material && o.material.type === 'ShaderMaterial') L.push(o.type + ':' + o.geometry.type + ':' + (o.isInstancedMesh ? 'inst' : '')); }); return L; }""")
    print(names)
    for i in range(len(names)):
        pg.evaluate(f"""() => {{ let k = 0; window.__S.S5.scene.traverse(o => {{ if (o.material && o.material.type === 'ShaderMaterial') {{ o.visible = (k !== {i}); k++; }} }}); window.render(15.0); }}""")
        pg.screenshot(path=f"qa/s5_only_hide_{i}.png")
    b.close()
