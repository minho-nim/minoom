import bpy,math
from mathutils import Vector
from pathlib import Path
root=Path(__file__).resolve().parents[1]/'public/assets';out=root/'previews';out.mkdir(exist_ok=True)
for name,slug in [('table','modern_coffee_table_01'),('chair','modern_arm_chair_01')]:
 bpy.ops.wm.read_factory_settings(use_empty=True)
 bpy.ops.import_scene.gltf(filepath=str(root/'models'/f'{slug}.glb'))
 objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];points=[o.matrix_world@Vector(c) for o in objects for c in o.bound_box];lo=Vector([min(v[i] for v in points) for i in range(3)]);hi=Vector([max(v[i] for v in points) for i in range(3)]);center=(lo+hi)/2;extent=max(hi-lo)
 print(name,'bounds',list(lo),list(hi),flush=True)
 bpy.ops.object.camera_add(location=center+Vector((1.6,-2.3,1.7))*extent)
 camera=bpy.context.object;camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=extent*1.9;bpy.context.scene.camera=camera
 for loc,power,size in [((2,-3,5),550,4),((-3,-1,3),300,3)]:
  bpy.ops.object.light_add(type='AREA',location=center+Vector(loc)*extent);bpy.context.object.data.energy=power*extent**2;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=size*extent;bpy.context.object.rotation_euler=(center-bpy.context.object.location).to_track_quat('-Z','Y').to_euler()
 scene=bpy.context.scene;scene.world=bpy.data.worlds.new('World');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.68,.67,.61,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.6
 scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=24;scene.cycles.use_denoising=False;scene.render.resolution_x=320;scene.render.resolution_y=256;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=88;scene.render.filepath=str(out/f'{name}.jpg');scene.view_settings.view_transform='AgX';scene.render.threads_mode='FIXED';scene.render.threads=4
 bpy.ops.render.render(write_still=True)
