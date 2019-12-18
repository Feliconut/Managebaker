<div class="container">
    <h2><?php echo e($apiDocument->data->attributes->title); ?></h2>

    <div>
        <?php $__currentLoopData = $posts; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $post): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div>
                <?php $user = ! empty($post->relationships->user->data) ? $getResource($post->relationships->user->data) : null; ?>
                <h3><?php echo e($user ? $user->attributes->username : $translator->trans('core.lib.username.deleted_text')); ?></h3>
                <div class="Post-body">
                    <?php echo $post->attributes->contentHtml; ?>

                </div>
            </div>

            <hr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>

    <?php if(isset($apiDocument->links->prev)): ?>
        <a href="<?php echo e($url(['page' => $page - 1])); ?>">&laquo; <?php echo e($translator->trans('core.views.discussion.previous_page_button')); ?></a>
    <?php endif; ?>

    <?php if(isset($apiDocument->links->next)): ?>
        <a href="<?php echo e($url(['page' => $page + 1])); ?>"><?php echo e($translator->trans('core.views.discussion.next_page_button')); ?> &raquo;</a>
    <?php endif; ?>
</div>
