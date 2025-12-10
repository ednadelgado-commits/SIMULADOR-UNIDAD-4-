let scene, camera, renderer, controls;
let ambientLight, dirLight, pointLight;
let objects = [], selected = null;

    // Cargar texturas
    const loader = new THREE.TextureLoader();
    const textures = {
    tex1: loader.load('assets/textura1.jpg'),
    tex2: loader.load('assets/textura2.jpg'),
    tex3: loader.load('assets/textura3.jpg')
    };

    // Inicializar
    init();
    animate();

    function init() {
    const container = document.getElementById('canvas-container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0c10);

    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(5, 5, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Plano de referencia
    const grid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(grid);

    // Luces
    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    pointLight = new THREE.PointLight(0xffffff, 0.7);
    pointLight.position.set(-4, 4, -3);
    scene.add(pointLight);

    window.addEventListener('resize', onWindowResize);

    // Botones de objetos
    document.getElementById('btnCubo').addEventListener('click', () => addObject('cube'));
    document.getElementById('btnEsfera').addEventListener('click', () => addObject('sphere'));
    document.getElementById('btnCil').addEventListener('click', () => addObject('cylinder'));
    document.getElementById('btnDup').addEventListener('click', duplicateObject);
    document.getElementById('btnDel').addEventListener('click', deleteObject);

    // Botones de relleno
    document.getElementById('fillColor').addEventListener('input', updateColor);
    document.getElementById('modeHom').addEventListener('click', () => setFill('homog'));
    document.getElementById('modeGrad').addEventListener('click', () => setFill('vertex'));
    document.getElementById('modeTex').addEventListener('click', () => setFill('texture'));
    document.getElementById('modeFrac').addEventListener('click', () => setFill('shader'));

    // Botones de texturas
    document.getElementById('tex1').addEventListener('click', () => applyTexture(textures.tex1));
    document.getElementById('tex2').addEventListener('click', () => applyTexture(textures.tex2));
    document.getElementById('tex3').addEventListener('click', () => applyTexture(textures.tex3));

    // Botones de sombreado
    document.getElementById('shadeConst').addEventListener('click', () => setShading('basic'));
    document.getElementById('shadeFlat').addEventListener('click', () => setShading('flat'));
    document.getElementById('shadeGour').addEventListener('click', () => setShading('lambert'));
    document.getElementById('shadePhong').addEventListener('click', () => setShading('phong'));
    document.getElementById('shadeFrac').addEventListener('click', () => setShading('shader'));
    document.getElementById('wireToggle').addEventListener('click', toggleWireframe);
    document.getElementById('resetMat').addEventListener('click', resetMaterial);

    // Luces
    document.getElementById('chkAmbient').addEventListener('change', e => ambientLight.visible = e.target.checked);
    document.getElementById('chkDir').addEventListener('change', e => dirLight.visible = e.target.checked);
    document.getElementById('chkPoint').addEventListener('change', e => pointLight.visible = e.target.checked);
    ['dirX','dirY','dirZ'].forEach(id => document.getElementById(id).addEventListener('input', updateDirLight));

    // Transformaciones
    ['posX','posY','posZ','rotX','rotY','rotZ','scale'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateTransform);
    });

    // Selección con click
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    }

    // Funciones de objetos
    function addObject(type) {
    let geom;
    if(type==='cube') geom = new THREE.BoxGeometry(1,1,1);
    if(type==='sphere') geom = new THREE.SphereGeometry(0.5,32,32);
    if(type==='cylinder') geom = new THREE.CylinderGeometry(0.5,0.5,1,32);

    const mat = new THREE.MeshStandardMaterial({ color: 0x00aaff });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(0,0.5,0);
    mesh.originalMaterial = mat;
    scene.add(mesh);
    objects.push(mesh);
    selected = mesh;
    }

    function duplicateObject() {
    if(!selected) return;
    const clone = selected.clone();
    clone.position.x += 1;
    scene.add(clone);
    objects.push(clone);
    selected = clone;
    }

    function deleteObject() {
    if(!selected) return;
    scene.remove(selected);
    objects = objects.filter(o => o !== selected);
    selected = objects.length ? objects[objects.length-1] : null;
    }

    // Funciones de relleno y textura
    function applyTexture(tex){
    if(!selected) return;
    selected.material = new THREE.MeshStandardMaterial({ map: tex });
    selected.material.needsUpdate = true;
    }

    function updateColor() {
    if(!selected) return;
    selected.material.color.set(document.getElementById('fillColor').value);
    }

    function setFill(mode){
    if(!selected) return;
    let mat;
    switch(mode){
        case 'homog': mat = new THREE.MeshStandardMaterial({color: document.getElementById('fillColor').value}); break;
        case 'vertex':
        const geom = selected.geometry.clone();
        const count = geom.attributes.position.count;
        const colors = [];
        for(let i=0;i<count;i++) colors.push(Math.random(),Math.random(),Math.random());
        geom.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));
        mat = new THREE.MeshStandardMaterial({vertexColors:true});
        selected.geometry = geom;
        break;
        case 'texture': mat = new THREE.MeshStandardMaterial({map: textures.tex1}); break;
        case 'shader':
        mat = new THREE.ShaderMaterial({
            uniforms:{ color:{ value: new THREE.Color(document.getElementById('fillColor').value) } },
            vertexShader: `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
            fragmentShader: `varying vec3 vPos; void main(){ gl_FragColor = vec4(abs(sin(vPos.x*10.0)),abs(sin(vPos.y*10.0)),abs(sin(vPos.z*10.0)),1.0); }`
        });
        break;
        default: mat = new THREE.MeshStandardMaterial({color: document.getElementById('fillColor').value});
    }
    mat.wireframe = selected.material.wireframe || false;
    selected.material = mat;
    selected.material.needsUpdate = true;
    }

    // Sombreado
    function setShading(type){
    if(!selected) return;
    let color = selected.material.color.getHex();
    let mat;
    switch(type){
        case 'basic': mat = new THREE.MeshBasicMaterial({color}); break;
        case 'flat': mat = new THREE.MeshStandardMaterial({color, flatShading:true}); break;
        case 'lambert': mat = new THREE.MeshLambertMaterial({color}); break;
        case 'phong': mat = new THREE.MeshPhongMaterial({color}); break;
        case 'shader':
        mat = new THREE.ShaderMaterial({
            uniforms:{ color:{ value: new THREE.Color(color) } },
            vertexShader: `varying vec3 vPos; void main(){ vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
            fragmentShader: `varying vec3 vPos; void main(){ gl_FragColor=vec4(abs(sin(vPos.x*5.0)),abs(sin(vPos.y*5.0)),abs(sin(vPos.z*5.0)),1.0); }`
        }); break;
        default: mat = new THREE.MeshStandardMaterial({color});
    }
    mat.wireframe = selected.material.wireframe || false;
    selected.material = mat;
    }

    function toggleWireframe(){
    if(!selected) return;
    selected.material.wireframe = !selected.material.wireframe;
    }

    function resetMaterial(){
    if(!selected) return;
    selected.material = selected.originalMaterial;
    }

    // Transformaciones
    function updateTransform(){
    if(!selected) return;
    selected.position.x = parseFloat(document.getElementById('posX').value);
    selected.position.y = parseFloat(document.getElementById('posY').value);
    selected.position.z = parseFloat(document.getElementById('posZ').value);
    selected.rotation.x = parseFloat(document.getElementById('rotX').value);
    selected.rotation.y = parseFloat(document.getElementById('rotY').value);
    selected.rotation.z = parseFloat(document.getElementById('rotZ').value);
    const s = parseFloat(document.getElementById('scale').value);
    selected.scale.set(s,s,s);
    }

    // Iluminación
    function updateDirLight(){
    dirLight.position.set(
        parseFloat(document.getElementById('dirX').value),
        parseFloat(document.getElementById('dirY').value),
        parseFloat(document.getElementById('dirZ').value)
    );
    }

    // Selección con click
    function onPointerDown(event){
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
        ((event.clientX-rect.left)/rect.width)*2-1,
        -((event.clientY-rect.top)/rect.height)*2+1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse,camera);
    const intersects = raycaster.intersectObjects(objects);
    if(intersects.length>0) selected = intersects[0].object;
    }

    // Resize
    function onWindowResize(){
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    }

    // Animación
    function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
    controls.update();
    }
