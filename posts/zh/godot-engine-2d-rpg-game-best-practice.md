---
title: "Godot Engine 即时战斗 2D RPG 最佳实践"
excerpt: "这篇博客记录了作者在使用 Godot 制作即时战斗 2D RPG 游戏时梳理出的最佳实践。虽然其中可能会有一些错误或不合时宜的结论，但这些结论都是基于作者的实践经验得出的。随着作者对 Godot 的理解逐渐深入，这些结论也会得到不断更新。"
date: "2023-4-30"
locale: "zh"
tags: [Godot, Best Practice]
coverImage: https://rorsch-1256426089.file.myqcloud.com/public/202304302040363.png
---

这篇博客记录了作者在使用 Godot 制作即时战斗 2D RPG 游戏时梳理出的最佳实践。虽然其中可能会有一些错误或不合时宜的结论，但这些结论都是基于作者的实践经验得出的。随着作者对 Godot 的理解逐渐深入，这些结论也会得到不断更新。

## Godot Engine 基本概念

Godot 的基本概念与 demo 实践在官方文档已经写得很清楚了，此处不再赘述，将 Godot 官方文档中的 [Getting Started](https://docs.godotengine.org/en/stable/getting_started/introduction/index.html) 这一部分阅读完，跟着 [Your Frist 2D Game](https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html) 这一节做一个小游戏就对 Godot 有了比较基本的认识了。

## 碰撞检测 (Collision Detection)

举例一个实际的场景，在即时战斗 2D RPG 中，玩家和怪物的战斗往往有多个碰撞检测范围：

1. **移动碰撞**。显然，你不会希望玩家可以在移动时会直接穿过怪物（俗称穿模），所以玩家操作的角色和怪物都会有一个移动碰撞范围。
2. **玩家的攻击范围与怪物的受击范围的碰撞**。在玩家攻击怪物时，玩家会有自己的攻击范围，怪物会有自己的受击范围。只有玩家的攻击范围和怪物的受击范围有重合时，我们才认为玩家的这次攻击是有效的。
3. **玩家的受击范围与怪物的攻击范围的碰撞**。同第二点。

所以玩家操作的角色和怪物都会有至少三个不同的 [CollisionShape2D](https://docs.godotengine.org/en/stable/classes/class_collisionshape2d.html) 节点 来表示移动碰撞范围，攻击范围，受击范围。

### CollisionShape2D

Godot 提供了 `CollisionShape2D` 节点来表示碰撞检测的形状，你可以自由设置多种形状：

![image-20230430194244094](https://rorsch-1256426089.file.myqcloud.com/public/202304301942811.png)



举个例子，这里我们使用了两个圆形来表示攻击范围，一个椭圆形来表示受击范围：



![image-20230430192724984](https://rorsch-1256426089.file.myqcloud.com/public/202304301927891.png)

![image-20230430193937663](https://rorsch-1256426089.file.myqcloud.com/public/202304301939003.png)

在上图中你可能看到了 4 个 `CollisionShape2D`, 这里我额外用了一个 `CollisionSharp2D` 来表示玩家与 NPC/物品 的交互检测。

需要注意的是，`CollisionShape2D` 只是用来描述碰撞形状外形的 Node，这个 Node 不含有任何处理碰撞检测的逻辑，就如他的名字 `CollisionShape2D` 一样，只是 collision shape 而已。所以我们需要使用到 [Area2D](https://docs.godotengine.org/en/stable/tutorials/physics/using_area_2d.html) Node 来处理碰撞检测的逻辑。

### Area2D

Area2D 提供了一些 [signals](https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html) 来处理碰撞检测的逻辑。请务必记住，**使用 `body_entered` 和 `body_exited`** 而不是 `area_entered` 而不是 `area_exited`: 

![image-20230430195310741](https://rorsch-1256426089.file.myqcloud.com/public/202304301953547.png)



连接 signal 后处理攻击范围/受击范围的检测逻辑：

```gdscript
func _on_defense_range_body_entered(body):
	if body.is_in_group("enemies") && body not in attacking_player_enemies:
		attacking_player_enemies.push_front(body)

func _on_defense_range_body_exited(body):
	var enemy_index = attacking_player_enemies.find(body)
	if enemy_index != -1:
		attacking_player_enemies.remove_at(enemy_index)


func _on_attack_range_body_entered(body):
	if body.is_in_group("enemies") && body not in attacking_enemies:
		attacking_enemies.push_front(body)


func _on_attack_range_body_exited(body):
	var enemy_index = attacking_enemies.find(body)
	if enemy_index != -1:
		attacking_enemies.remove_at(enemy_index)
```

当检测到怪物的攻击范围/受击范围与玩家的受击范围/攻击范围发生相交时即触发上述逻辑。

### Collision Layer & Collision Mask

如果我们的游戏场景中有非常多 `Area2D`，这些 `Area2D` 互相都会检测碰撞，并且还会触发我们监听碰撞的函数，会给我们的程序造成不必要的开销。此时我们可以将这些 `Area2D` 的碰撞检测**分层**。

基于上文提到的场景说明，你可能希望表示玩家受击范围的 `Area2D` 只检测表示怪物攻击范围的 `Area2D`，这个时候我们就需要用到 `Area2D` 提供的属性 `Collision Layer`与`Collision Mask`。

以下是表示玩家攻击范围  `Area2D` 的 `Collision Layer` 与 `Collision Mask  `设置：

![image-20230430201413431](https://rorsch-1256426089.file.myqcloud.com/public/202304302014611.png)

这样的设置表达的是此 `Area2D` 在第 3 层，只检测第 4 层的碰撞。所以很显然，表示怪物受击范围的 `Area2D` 的会这样设置：

![image-20230430201939067](https://rorsch-1256426089.file.myqcloud.com/public/202304302019087.png)

因为玩家的攻击范围 `Area2D` 检测第 4 层的碰撞，而表示怪物受击范围的 `Area2D` 的 `Collision Layer` 在第 4 层，所以只有它们会互相检测，减少了不必要的性能开销。

这里注意，`Scene` 的根节点的 `Layer`一定要加上所有子节点使用的`Layer`，上述效果才会生效:

![image-20230430202517369](https://rorsch-1256426089.file.myqcloud.com/public/202304302025746.png)
