"""Own minoom sofa / bed: lightweight upholstered meshes, using approved ambientCG fabric.
Blender 4.x. Exports real GLB furniture and matching catalog thumbnails.
"""
import bpy,math
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[1]/'public/assets';(root/'models').mkdir(exist_ok=True)
def mat(name,color,cloth=False):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes['Principled BSDF'];p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=.86 if cloth else .6
 if cloth:
  tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(root/'materials/linen/color.jpg'));m.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color'])
 return m
def box(name,p,s,m,r=.035,rotation=(0,0,0)):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=name;o.dimensions=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);b=o.modifiers.new('Soft upholstery','BEVEL');b.width=min(r,min(s)*.47);b.segments=4;o.modifiers.new('Weighted normals','WEIGHTED_NORMAL');o.rotation_euler=rotation;return o
def line(name,points,material,radius=.004):
 curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.bevel_depth=radius;curve.bevel_resolution=1;s=curve.splines.new('POLY');s.points.add(len(points)-1)
 for p,v in zip(s.points,points):p.co=(*v,1)
 obj=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(obj);obj.data.materials.append(material)
def pillow(name,loc,width,depth,height,material,tilt=0):return box(name,loc,(width,depth,height),material,min(height*.47,.115),(tilt,0,.025))
def sofa():
 wood=mat('Smoked oak',(.3,.2,.12));linen=mat('Warm linen',(.9,.86,.78),True);seam=mat('Linen piping',(.68,.64,.55));accent=mat('Sage cotton',(.49,.55,.42));w,d=2.5,.95
 for x in [-1,1]:
  for y in [-1,1]:box('Oak foot',(x*1.06,y*.31,.09),(.085,.085,.18),wood,.012)
 box('Upholstered base',(0,0,.27),(2.45,.91,.27),linen,.11)
 box('Back rail',(0,.355,.56),(2.47,.23,.48),linen,.105)
 for x in [-1,1]:box('Soft arm',(x*1.12,-.015,.47),(.25,.9,.48),linen,.105)
 for x in [-.51,.51]:
  pillow('Seat cushion',(x,-.075,.46),.99,.69,.2,linen)
  pillow('Back cushion',(x,.29,.66),1.0,.2,.43,linen,math.radians(-9))
  line('Seat seam',[(x-.43,-.39,.475),(x+.43,-.39,.475),(x+.46,.16,.475)],seam,.0028)
 pillow('Loose cushion',(-.86,.03,.66),.38,.17,.38,accent,math.radians(-16))
 pillow('Loose linen cushion',(.84,.04,.67),.37,.18,.36,linen,math.radians(-12))
def bed():
 oak=mat('Natural oak',(.51,.35,.21));linen=mat('Ivory linen',(.93,.9,.82),True);blanket=mat('Oatmeal duvet',(.72,.7,.61));seam=mat('Duvet stitching',(.6,.58,.5));w,d=1.8,2.1
 box('Bed base',(0,0,.18),(1.77,2.06,.25),oak,.04)
 for x in [-.7,.7]:
  for y in [-.83,.83]:box('Inset foot',(x,y,.075),(.1,.1,.15),oak,.015)
 box('Padded headboard',(0,.99,.61),(1.8,.12,1.02),linen,.055)
 pillow('Mattress',(0,0,.43),1.76,2.02,.26,linen)
 for x in [-.44,.44]:pillow('Pillow',(x,.69,.61),.72,.45,.19,linen,.03)
 # A continuous folded duvet with gentle broad wrinkles, rather than a flat slab.
 nx,ny=30,34;verts=[];faces=[]
 for j in range(ny+1):
  y=-1.035+j*1.53/ny
  for i in range(nx+1):
   x=-.9+i*1.8/nx;edge=max(0,(abs(x)-.76)/.14);z=.606-.12*edge**1.6+.009*math.sin(x*17+y*9)+.005*math.sin(y*28+x*4);verts.append((x,y,z))
 for j in range(ny):
  for i in range(nx):
   k=j*(nx+1)+i;faces.append((k,k+1,k+nx+2,k+nx+1))
 mesh=bpy.data.meshes.new('Duvet');mesh.from_pydata(verts,[],faces);mesh.update();obj=bpy.data.objects.new('Draped duvet',mesh);bpy.context.collection.objects.link(obj);obj.data.materials.append(blanket)
 for p in mesh.polygons:p.use_smooth=True
 solid=obj.modifiers.new('Duvet thickness','SOLIDIFY');solid.thickness=.035
 pillow('Folded duvet edge',(0,.45,.64),1.78,.22,.075,blanket)
 for x in [-.75,.75]:line('Hem stitching',[(x,-1.01,.61),(x,.32,.61)],seam,.002)
for name,build,preview in [('minoom-sofa',sofa,'basic-0'),('minoom-bed',bed,'basic-1')]:
 bpy.ops.wm.read_factory_settings(use_empty=True);build();bpy.context.view_layer.update()
 # Blender is Z-up. Front is -Y; export maps this to glTF front +Z.
 # Apply bevels/curves, then batch by material to keep mobile draw calls small.
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.convert(target='MESH')
 batches={}
 for obj in list(bpy.context.scene.objects):
  if obj.type=='MESH':batches.setdefault(obj.active_material.name,[]).append(obj)
 for objects in batches.values():
  bpy.ops.object.select_all(action='DESELECT')
  for obj in objects:obj.select_set(True)
  bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join()
 bpy.ops.export_scene.gltf(filepath=str(root/'models'/f'{name}.glb'),export_format='GLB',export_image_format='JPEG',export_jpeg_quality=82,export_apply=True,export_cameras=False,export_lights=False)
 objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];points=[o.matrix_world@Vector(c) for o in objects for c in o.bound_box];lo=Vector([min(v[i] for v in points) for i in range(3)]);hi=Vector([max(v[i] for v in points) for i in range(3)]);center=(lo+hi)/2;extent=max(hi-lo)
 bpy.ops.object.camera_add(location=center+Vector((1.5,-2.4,1.7))*extent);camera=bpy.context.object;camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=extent*1.55;bpy.context.scene.camera=camera
 for pos,energy in [((2,-3,5),450),((-3,-1,3),240)]:
  bpy.ops.object.light_add(type='AREA',location=center+Vector(pos)*extent);o=bpy.context.object;o.data.energy=energy*extent**2;o.data.size=extent*4;o.rotation_euler=(center-o.location).to_track_quat('-Z','Y').to_euler()
 scene=bpy.context.scene;scene.world=bpy.data.worlds.new('World');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.72,.67,.59,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.7;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=32;scene.cycles.use_denoising=False;scene.render.resolution_x=400;scene.render.resolution_y=320;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=90;scene.render.filepath=str(root/'previews'/f'{preview}.jpg');scene.render.threads_mode='FIXED';scene.render.threads=4;bpy.ops.render.render(write_still=True)
