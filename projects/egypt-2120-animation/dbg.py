from playwright.sync_api import sync_playwright
from pathlib import Path
HERE = Path(__file__).resolve().parent
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge", headless=True)
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto((HERE / "index.html").as_uri() + "?capture=1"); pg.wait_for_function("window.__ready === true", timeout=120000)
    print(pg.evaluate("""() => { const S = window.__S.S5; S.update(15.0); const cam = S.cam;
      const out = []; S.scene.traverse(o => { if (o.isMesh || o.isPoints) { o.geometry.computeBoundingSphere(); const c = o.geometry.boundingSphere.center.clone().applyMatrix4(o.matrixWorld);
        out.push([o.type, o.geometry.type, o.material.type, +c.distanceTo(cam.position).toFixed(0), o.isInstancedMesh ? o.count : 1]); } });
      return {cam: cam.position.toArray().map(v=>+v.toFixed(1)), objs: out.slice(0, 40)}; }"""))
    for hide in ["none", "ShaderMaterial", "MeshPhysicalMaterial", "MeshStandardMaterial"]:
        pg.evaluate(f"""() => {{ const S = window.__S.S5; S.scene.traverse(o => {{ if (o.material) o.visible = ('{hide}' === 'none') || o.material.type !== '{hide}'; }}); window.render(15.0); }}""")
        pg.screenshot(path=f"qa/s5_hide_{hide}.png")
    b.close()
