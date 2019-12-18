<?php echo array_get($forum, 'headerHtml'); ?>


<div id="app" class="App">

    <div id="app-navigation" class="App-navigation"></div>

    <div id="drawer" class="App-drawer">

        <header id="header" class="App-header">
            <div id="header-navigation" class="Header-navigation"></div>
            <div class="container">
                <h1 class="Header-title">
                    <a href="<?php echo e(array_get($forum, 'baseUrl')); ?>" id="home-link">
                        <?php if($logo = array_get($forum, 'logoUrl')): ?>
                            <img src="<?php echo e($logo); ?>" alt="<?php echo e(array_get($forum, 'title')); ?>" class="Header-logo">
                        <?php else: ?>
                            <?php echo e(array_get($forum, 'title')); ?>

                        <?php endif; ?>
                    </a>
                </h1>
                <div id="header-primary" class="Header-primary"></div>
                <div id="header-secondary" class="Header-secondary"></div>
            </div>
        </header>

    </div>

    <main class="App-content">
        <div id="content"></div>

        <?php echo $content; ?>


        <div class="App-composer">
            <div class="container">
                <div id="composer"></div>
            </div>
        </div>
    </main>

</div>

<?php echo array_get($forum, 'footerHtml'); ?>

