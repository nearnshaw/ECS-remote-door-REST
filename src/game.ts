@Component('doorState')
export class DoorState {
  closed: boolean = true
  openPos: Vector3 = new Vector3(0, 90, 0)
  closedPos: Vector3 = new Vector3(0, 0, 0)
  fraction: number = 0

  constructor(closed : boolean = true){
    this.closed = closed 
  }
}

const doors = engine.getComponentGroup(Transform, DoorState)

export class RotatorSystem implements ISystem {
 
  update(dt: number) {
    for (let door of doors.entities) {
      let state = door.get(DoorState)
      let transform = door.get(Transform)
      
      if (state.closed == false && state.fraction < 1) {
        let pos = Vector3.Lerp(state.closedPos, state.openPos, state.fraction)
        transform.rotation.eulerAngles = pos
        state.fraction += dt/2
      } else if (state.closed == true && state.fraction > 0) {
        let pos = Vector3.Lerp(state.closedPos, state.openPos, state.fraction)
        transform.rotation.eulerAngles = pos
        state.fraction -= dt/2
      }
    }
  }
}


const doorMaterial = new Material()
doorMaterial.albedoColor = Color3.Red()
doorMaterial.metallic = 0.9
doorMaterial.roughness = 0.1

// Define fixed walls
const wall1 = new Entity()
wall1.set(new Transform())
wall1.get(Transform).position.set(5.75, 1, 3)
wall1.get(Transform).scale.set(1.5, 2, 0.05)
wall1.set(new BoxShape())
wall1.get(BoxShape).withCollisions = true

const wall2 = new Entity()
wall2.set(new Transform())
wall2.get(Transform).position.set(3.25, 1, 3)
wall2.get(Transform).scale.set(1.5, 2, 0.05)
wall2.set(new BoxShape())
wall2.get(BoxShape).withCollisions = true


// Define wrapper entity to rotate door. This is the entity that actually rotates.
const doorPivot = new Entity()
doorPivot.set(new Transform())
doorPivot.get(Transform).position.set(4, 1, 3)
doorPivot.set(new DoorState())

// Add actual door to scene. This entity doesn't rotate, its parent drags it with it.
const door = new Entity()
door.set(new Transform())
door.get(Transform).position.set(0.5, 0, 0)
door.get(Transform).scale.set(1, 2, 0.05)
door.set(new BoxShape())
door.set(doorMaterial)
door.get(BoxShape).withCollisions = true
door.set(
  new OnClick(_ => {
    let state = doorPivot.get(DoorState)
    state.closed = !state.closed
    callAPI(state.closed)
  })
)

// Set the door as a child of doorPivot
door.setParent(doorPivot)

// Add all entities to engine
engine.addEntity(wall1)
engine.addEntity(wall2)
engine.addEntity(doorPivot)
engine.addEntity(door)

// Add system to engine
engine.addSystem(new RotatorSystem())

const apiUrl = "http://127.0.0.1:7753"

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

function callAPI(closed: boolean){
  let url
  if (closed){
    url = `${apiUrl}/api/door/close`
  }
  else {
    url = `${apiUrl}/api/door/open`
  }
  
  let method = "POST"
  let body = ""
  

  executeTask(async () => {
    try {
      let response = await fetch(url)
      let json = await response.json()
      log("sent request to API" + closed)
      log(json)
    } catch {
      log("failed to reach URL")
    }
  })


  // fetch(url)
  //   .then(res => res.json())
  //   .then(function(res) {
  //     if (res.error !== undefined) {
  //       return error(url, res.error);
  //     }
  //     const keys = Object.keys(res); 
  //     fetch(url, { method, body, headers })
  //       .then(res => res.json())
  //       .then(function(res) {
  //         if (res.error !== undefined) {
  //           return error(res.error);
  //         }
  //       }) 
  //   })
}


// function syncDoor(){
 
//     // GET door state
//     fetch(apiUrl)
//       .then(res => res.json())
//       .then(function(res) {
//         const { wallBlockColors } = scene.state;

//         Object.keys(wallBlockColors).forEach(function(blockKey) {
//           const isColorSet = res.some((pixel: IDBPixel) => {
//             const { x, y, color } = pixel;
//             const pixelKey = `${x}-${y}`;

//             if (pixelKey === blockKey) {
//               wallBlockColors[blockKey] = color;
//               return true;
//             }

//             return false;
//           });

//           if (isColorSet === false) {
//             wallBlockColors[blockKey] = "transparent";
//           }
//         });

//         scene.setState({ wallBlockColors });
//       })
//       .catch(err => error("error getting all pixels", err));
//   }
// }