import { useStore } from "src/stores/example-store";
import { Mesh, MeshPhongMaterial, PlaneGeometry, Scene } from "three";
import { computed } from "vue";

const planeMaterial = new MeshPhongMaterial({
  color: 0x22ffff,
  shininess: 55,
});
const planeActiveMaterial = new MeshPhongMaterial({
  color: 0x00ffff,
  shininess: 30,
});

let plans: Mesh[] | null[] = [null, null];
const createPlane = (
  scene: Scene,
  width: number = 122,
  height: number = 62
) => {
  const plane = new PlaneGeometry(width, height, 50);

  // 添加一个平面
  const planeMesh = new Mesh(plane, planeMaterial);
  planeMesh.position.set(-41, 0, 0);
  // scene.add(planeMesh);
  plans[0] = planeMesh;

  const planeMesh2 = new Mesh(plane, planeMaterial);
  planeMesh2.position.set(width / 2, height / 2, 0);

  scene.add(planeMesh2);
  plans[1] = planeMesh2;
};

const activePlane = (index: number) => {
  if (plans[index]) {
    plans[index]!.material = planeActiveMaterial;
  }
};

const deactivePlane = (index: number) => {
  if (plans[index]) {
    plans[index]!.material = planeMaterial;
  }
};

export default { createPlane, activePlane, deactivePlane };
