import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { Box } from './Box'
import { Robot } from './Robot'

const robotConfig = {
  urdfPath: 'models/aris_support/urdf/aris_imitate_cell_ur.urdf',
  urdfPackagePaths: {
    aris_support: 'models/aris_support/',
    ur_e_description: 'models/ur_e_description',
  },
}

export interface ExampleCanvasProps {
  rotation: number
  jointValues: number[]
}

export const ExampleCanvas: React.FC<ExampleCanvasProps> = ({ rotation, jointValues }) => {
  return (
    <Canvas gl={{ logarithmicDepthBuffer: true }} shadows camera={{ position: [-15, 10, 10], fov: 25, zoom: 3 }}>
      <ambientLight intensity={2} />
      <directionalLight position={[-10, 10, -10]} castShadow />
      <fog attach="fog" args={[0xff0000, 0, 250]} />
      <Box position={[-1, 1, -2]} rotation={[rotation, 0, rotation]} />
      <Robot
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        urdfPath={robotConfig.urdfPath}
        urdfPackagePaths={robotConfig.urdfPackagePaths}
        jointValues={[rotation / 2 + 2, -rotation / 2 - 2, rotation / 3, 0, 0, 0]}
      />
      <ContactShadows />
      <Environment background preset="sunset" blur={0.8} />
      <OrbitControls makeDefault enableZoom minAzimuthAngle={0} minPolarAngle={0} />
    </Canvas>
  )
}
