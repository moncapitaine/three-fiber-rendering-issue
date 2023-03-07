import * as THREE from 'three'
import { GroupProps } from '@react-three/fiber'
import URDFLoader, { URDFRobot } from 'urdf-loader'
import { useLoader } from '@react-three/fiber'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { useEffect } from 'react'

export interface RobotProps extends GroupProps {
  urdfPath: string
  urdfPackagePaths: Record<string, string>
  jointValues: number[]
}

export const Robot: React.FC<RobotProps> = (props) => {
  const { urdfPath, urdfPackagePaths, jointValues } = props
  const robot: URDFRobot = useLoader(URDFLoader as any, urdfPath, (loader: URDFLoader) => {
    console.log('loading robot')

    loader.packages = urdfPackagePaths
    loader.loadMeshCb = (path: any, manager: any, done: any) => {
      console.log('building the robot part', path)
      if (/\.dae$/i.test(path)) {
        const loader = new ColladaLoader(manager)
        loader.load(path, (dae) => {
          const mainGroup = new THREE.Group()
          mainGroup.up = dae.scene.up
          mainGroup.name = dae.scene.name
          mainGroup.scale.set(dae.scene.scale.x, dae.scene.scale.y, dae.scene.scale.z)
          mainGroup.rotation.set(
            dae.scene.rotation.x,
            dae.scene.rotation.y,
            dae.scene.rotation.z,
            dae.scene.rotation.order
          )
          mainGroup.receiveShadow = mainGroup.castShadow = true
          dae.scene.children.forEach((child: any) => {
            if (child.isMesh) {
              const mesh = getNewMesh(child as THREE.Mesh)
              mainGroup.add(mesh)
              return
            } else if (child.isGroup) {
              const group = getNewGroup(child as THREE.Group)
              if (group) {
                mainGroup.add(group)
              }
              return
            }
          })
          done(mainGroup)
        })
      } else {
        console.warn(`URDFLoader: Could not load model at ${path}.\nNo loader implemented`)
      }
    }
  })

  useEffect(() => {
    if (!robot || !jointValues || jointValues.length < 1) {
      return
    }
    Object.keys(robot.joints)
      .map((jointName) => robot.joints[jointName])
      .filter((joint) => joint.jointType === 'revolute')
      .forEach((joint, index) => {
        joint.setJointValue(jointValues[index])
      })
  }, [robot, jointValues])

  if (!robot) {
    return <></>
  }
  return (
    <group>
      <primitive object={robot} {...props} />
    </group>
  )
}

const getNewGroup = (oldGroup: THREE.Group): THREE.Group | undefined => {
  const mainGroup = new THREE.Group()
  mainGroup.name = oldGroup.name
  mainGroup.receiveShadow = mainGroup.castShadow = true
  mainGroup.scale.set(oldGroup.scale.x, oldGroup.scale.y, oldGroup.scale.z)
  mainGroup.position.set(oldGroup.position.x, oldGroup.position.y, oldGroup.position.z)
  mainGroup.rotation.set(oldGroup.rotation.x, oldGroup.rotation.y, oldGroup.rotation.z, oldGroup.rotation.order)

  mainGroup.receiveShadow = mainGroup.castShadow = true
  oldGroup.children.forEach((child: any) => {
    if (child.isMesh) {
      const mesh = getNewMesh(child as THREE.Mesh)
      mainGroup.add(mesh)
    } else if (child.isGroup) {
      const group = getNewGroup(child as THREE.Group)
      if (group) {
        group.name = oldGroup.name
        mainGroup.add(group)
      }
    } else {
      console.log('child not handled', child)
      return undefined
    }
  })
  return mainGroup
}

const getNewMesh = (oldMesh: THREE.Mesh): THREE.Mesh => {
  const material = oldMesh.material
  const mesh = new THREE.Mesh(oldMesh.geometry, material)
  mesh.name = oldMesh.name
  mesh.receiveShadow = mesh.castShadow = true
  mesh.scale.set(oldMesh.scale.x, oldMesh.scale.y, oldMesh.scale.z)
  mesh.position.set(oldMesh.position.x, oldMesh.position.y, oldMesh.position.z)
  mesh.rotation.set(oldMesh.rotation.x, oldMesh.rotation.y, oldMesh.rotation.z, oldMesh.rotation.order)
  return mesh
}
