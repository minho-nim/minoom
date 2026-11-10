"""Representative previews for the built-in procedural furniture categories (not user photos)."""
import bpy,math
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[1]/'public/assets';out=root/'previews';out.mkdir(exist_ok=True)
def material(color):
 m=bpy.data.materials.new('Surface');m.diffuse_color=(*color,1);m.use_nodes=True;m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(*color,1);m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.78;return m
def box(p,s,m):
 bpy.ops.mesh.primitive_cube_add(size=1,location=(p[0],-p[2],p[1]));o=bpy.context.object;o.dimensions=(s[0],s[2],s[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);bevel=o.modifiers.new('Soft edges','BEVEL');bevel.width=min(.025,min(s)*.22);bevel.segments=3;o.modifiers.new('Normals','WEIGHTED_NORMAL')
def cylinder(p,r1,r2,h,m):
 bpy.ops.mesh.primitive_cone_add(vertices=32,radius1=r1,radius2=r2,depth=h,location=(p[0],-p[2],p[1]));bpy.context.object.data.materials.append(m)
for kind in range(2,9):
 bpy.ops.wm.read_factory_settings(use_empty=True);wood=material((.51,.32,.17));cream=material((.76,.72,.63));white=material((.92,.89,.8));green=material((.38,.48,.28));metal=material((.25,.25,.21))
 if kind==0:
  w,d=2.5,.95;box((0,.25,0),(w,.32,d),cream);box((0,.62,-d/2+.12),(w,.5,.2),cream)
  for n in [-1,1]:box((n*(w/2-.1),.5,0),(.2,.45,d),cream)
  for n in [-.25,.25]:box((n*w,.46,.06),(w*.42,.16,d*.7),white)
 elif kind==1:
  w,d=1.8,2.1;box((0,.21,0),(w,.28,d),wood);box((0,.49,0),(w,.3,d),white);box((0,.67,.35),(w+.02,.12,d*.6),cream);box((0,.63,-d*.32),(w*.8,.2,.42),white);box((0,.6,-d/2),(w,1.05,.1),wood)
 elif kind in [2,4]:
  w,h,d=(1.2,.75,.8) if kind==2 else (1.6,.75,.7);box((0,h-.05,0),(w,.1,d),wood)
  for x in [-1,1]:
   for z in [-1,1]:box((x*(w/2-.08),h/2,z*(d/2-.08)),(.06,h-.1,.06),wood)
  if kind==4:box((0,h+.3,-.15),(.65,.4,.04),metal);box((0,h+.1,-.15),(.05,.2,.05),metal)
 elif kind==3:
  w,d=.5,.5;box((0,.43,0),(w,.1,d),wood);box((0,.7,-d/2+.04),(w,.4,.07),wood)
  for x in [-1,1]:
   for z in [-1,1]:box((x*w*.37,.2,z*d*.37),(.045,.4,.045),wood)
 elif kind==5:
  cylinder((0,.04,0),.22,.2,.08,metal);box((0,.85,0),(.035,1.7,.035),metal);cylinder((0,1.54,0),.27,.1575,.35,white)
 elif kind in [6,8]:
  box((0,.45,0),(1.3,.9,.5),wood)
  for n in [.33,.66]:box((0,.9*n,.255),(1.235,.015,.015),metal)
 elif kind==7:
  cylinder((0,.16,0),.14,.2,.32,cream)
  for n in range(5):
   bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=8,radius=.15,location=(math.sin(n*2)*.15,-math.cos(n*2)*.12,.45+n*.07));bpy.context.object.data.materials.append(green)
 objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];points=[o.matrix_world@Vector(c) for o in objects for c in o.bound_box];lo=Vector([min(v[i] for v in points) for i in range(3)]);hi=Vector([max(v[i] for v in points) for i in range(3)]);center=(lo+hi)/2;extent=max(hi-lo)
 bpy.ops.object.camera_add(location=center+Vector((1.5,-2.4,1.7))*extent);camera=bpy.context.object;camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=extent*1.55;bpy.context.scene.camera=camera
 for loc,power,size in [((2,-3,5),500,4),((-3,-1,3),250,3)]:
  bpy.ops.object.light_add(type='AREA',location=center+Vector(loc)*extent);o=bpy.context.object;o.data.energy=power*extent**2;o.data.shape='DISK';o.data.size=size*extent;o.rotation_euler=(center-o.location).to_track_quat('-Z','Y').to_euler()
 scene=bpy.context.scene;scene.world=bpy.data.worlds.new('World');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.72,.67,.59,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.7;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=24;scene.cycles.use_denoising=False;scene.render.resolution_x=320;scene.render.resolution_y=256;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=88;scene.render.filepath=str(out/f'basic-{kind}.jpg');scene.view_settings.view_transform='AgX';scene.render.threads_mode='FIXED';scene.render.threads=4;bpy.ops.render.render(write_still=True)
